import re
from enum import Enum
from pathlib import Path
from PIL import Image, ImageFont
from psd_tools import PSDImage

from .constants import *
from .view_psd_layers import get_all_psd_layers
from .render_psd import ColorMode, render_psd, render_text, insert_pil_image
from .create_template import PSDLayer
from .util import get_psd_or_raise
from .exceptions import FontNotFoundError, FieldNotFilled


class TextLayerAlignment(Enum):
    """Represents text layer aligment, present in
    the 'Justification' property of the layer.
    """

    LEFT = 1
    CENTER = 2
    RIGHT = 3


def apply_template(template, content_values, excluded_layers=tuple(),
                   resize_pixel_layers=True, ignore_not_filled_fields=True):
    """Apply template created by module 'create_template',
    replacing images and texts with values passed as parameter.

    :param template: Template created by 'create_template'.
    :type template: dict
    :param content_values: Dicts of tags that should be replaced in layers.
    :type content_values: dict
    :param exclude_layers: ID layers that mustn't be included to image.
    :type tree: tuple(int,...)
    :param resize_pixel_layers: Enable resize pixel layers replaced.
    :type resize_pixel_layers: bool
    :param ignore_not_filled_fields: Don't Raise if the field is not filled.
    :type ignore_not_filled_fields: bool
    """
    psd_file_path = Path(template[TEMPLATE_KEY_PSD_FILE])
    color_mode = ColorMode(template[TEMPLATE_KEY_PSD_COLOR_MODE])
    psd = get_psd_or_raise(psd_file_path)

    layers = get_all_psd_layers(psd)
    # fonts dict to avoid create many instances of same font
    fonts = {}
    excluded_layers = list(excluded_layers)
    layer_images = []
    for field in template[TEMPLATE_KEY_INPUT_FIELDS]:
        layer = __get_layer_by_id(
            layers, field[TEMPLATE_KEY_INPUT_FIELD_LAYER_ID]
        )
        layer_image = None
        if layer.layer_id not in excluded_layers:
            if PSDLayer(layer.kind) is PSDLayer.TYPE:
                text = __get_text_field(field, layer, content_values)

                if not ignore_not_filled_fields and text == layer.text:
                    raise FieldNotFilled(layer.name)

                layer_image = __get_image_type_field(
                    color_mode, fonts, field, layer, text
                )
                excluded_layers.append(layer.layer_id)
                layer_images.append((field, layer, layer_image))
            elif PSDLayer(layer.kind) is PSDLayer.PIXEL:
                layer_image = None
                if ignore_not_filled_fields:
                    try:
                        layer_image = __get_image_from_field(
                            field, content_values
                        )
                    except:
                        layer_image = None
                if layer_image:
                    excluded_layers.append(layer.layer_id)
                    layer_images.append((field, layer, layer_image))
                elif not ignore_not_filled_fields:
                    raise FieldNotFilled(layer.name)

    final_image = render_psd(
        psd_file_path, excluded_layers, original_size=True
    )
    for field, layer, layer_image in layer_images:
        position = field[TEMPLATE_KEY_INPUT_FIELD_POSITION]
        size = field[TEMPLATE_KEY_INPUT_FIELD_SIZE]
        if PSDLayer(layer.kind) is PSDLayer.TYPE:
            # value in this context is text
            position = __get_text_poisition_by_aligment(layer, layer_image)
        elif PSDLayer(layer.kind) is PSDLayer.PIXEL:
            if resize_pixel_layers:
                layer_image = layer_image.resize(size)
            else:
                box = (0, 0, size[0], size[1])
                layer_image = layer_image.resize(size, box=box)
        insert_pil_image(final_image, layer_image, position)

    return final_image


def __get_layer_by_id(layers, id_):
    try:
        return [l for l in layers if l.layer_id == id_][0]
    except IndexError:
        raise KeyError('ID does not exist.')


def __get_text_layer_properties(text_layer):
    fontset = text_layer.resource_dict['FontSet']
    rundata = text_layer.engine_dict['StyleRun']['RunArray']
    stylesheet = rundata[0]['StyleSheet']['StyleSheetData']
    font_size = stylesheet['FontSize']
    fill_color = stylesheet['FillColor']['Values']
    fill_color = tuple([int(fill_color[i] * 255) for i in range(1, 3 + 1)])
    fill_color += (int(stylesheet['FillColor']['Values'][0] * 255),)
    font_name = fontset[stylesheet['Font']]['Name']
    return (font_name, float(font_size), fill_color)


def __get_text_field(field, layer, content_values):
    text = field[TEMPLATE_KEY_INPUT_FIELD_VALUE]
    text = re.sub(
        TEMPLATE_REPLACE_PATTERN,
        lambda match: content_values.get(match.group(1), layer.text),
        text
    )
    return __apply_text_layer_filter(layer, text)


def __get_image_type_field(color_mode, fonts, field, layer, text):
    text_properties = __get_text_layer_properties(layer)
    font_name, font_size, fill_color = text_properties
    font = None
    try:
        font = fonts.get(
            text_properties[0],
            ImageFont.truetype(font_name + '.ttf', round(font_size))
        )
    except OSError:
        font = None

    if font is None:
        try:
            font = fonts.get(
                text_properties[0],
                ImageFont.truetype(font_name + '.otf', round(font_size))
            )
        except OSError:
            raise FontNotFoundError(font_name)
    return render_text(color_mode, text, font, fill_color)


def __apply_text_layer_filter(text_layer, text):
    """Return text with layer properties, applying uppercase,
    lowercase or capitalize.
    """
    filtered_text = text
    if text_layer.text.isupper():
        filtered_text = text.upper()
    elif text_layer.text.islower():
        filtered_text = text.lower()
    elif text_layer.text.istitle():
        filtered_text = text.title()
    return filtered_text


def __get_text_poisition_by_aligment(text_layer, layer_image):
    """Return text position based o original alignment."""
    runarray = text_layer.engine_dict['ParagraphRun']['RunArray']
    paragraph_sheet = runarray[0]['ParagraphSheet']
    justification = paragraph_sheet['Properties']['Justification']
    justification = TextLayerAlignment(justification)
    position = None
    if justification is TextLayerAlignment.LEFT:
        position = text_layer.offset
    elif justification is TextLayerAlignment.CENTER:
        center_x = text_layer.left + (text_layer.width / 2)
        x = center_x - (layer_image.width / 2)
        position = (int(x), text_layer.top)
    elif justification is TextLayerAlignment.RIGHT:
        x = text_layer.right - layer_image.width
        position = (x, text_layer.top)

    return position


def __get_image_from_field(field, content_values):
    """Return a PIL.Image from 'field' mixed with 'content_values'."""
    image_field = field[TEMPLATE_KEY_INPUT_FIELD_VALUE]
    image_url = re.sub(
        TEMPLATE_REPLACE_PATTERN,
        lambda match: content_values.get(match.group(1), ''),
        image_field
    )
    return Image.open(image_url)
