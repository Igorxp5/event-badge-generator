import re
import base64
from io import BytesIO
from pathlib import Path
from psd_tools import PSDImage
from PIL import Image, ImageFont
from urllib.request import urlopen

from .constants import *
from .util import get_psd_or_raise, is_url
from .view_psd_layers import get_all_psd_layers
from .create_template import get_text_layer_properties
from .exceptions import FontNotFoundError, FieldNotFilledError
from .render_psd import ColorMode, render_psd, render_text, insert_pil_image
from .classes import PSDLayer, TextLayerAlignment, CharSequenceCase, FontStyle


def apply_template(template, content_values, resize_pixel_layers=True):
    """Apply template created by module 'create_template',
    replacing images and texts with values passed as parameter.

    :param template: Template created by 'create_template'.
    :type template: dict
    :param content_values: Dicts of tags that should be replaced in layers.
    :type content_values: dict
    :param resize_pixel_layers: Enable resize pixel layers replaced.
    :type resize_pixel_layers: bool
    """
    psd_file_path = Path(template[TEMPLATE_KEY_PSD_FILE])
    color_mode = ColorMode(template[TEMPLATE_KEY_PSD_COLOR_MODE])
    psd = get_psd_or_raise(psd_file_path)

    layers = get_all_psd_layers(psd)
    # fonts dict to avoid create many instances of same font
    fonts = {}
    excluded_layers = list(template[TEMPLATE_KEY_EXCLUDED_LAYERS])
    input_fields = template[TEMPLATE_KEY_INPUT_FIELDS]
    layer_images = []
    for field in input_fields:
        input_value = None
        try:
            input_value = __get_field_value(field, content_values)
        except KeyError:
            raise FieldNotFilledError(field['value'])

        layer = __get_layer_by_id(
            layers, field[TEMPLATE_KEY_INPUT_FIELD_LAYER_ID]
        )
        if PSDLayer(layer.kind) is PSDLayer.TYPE:
            text = __apply_text_layer_filter(layer, input_value)
            text_layer_properties = get_text_layer_properties(layer)
            font, font_size, fill_color = text_layer_properties
            layer_image = __get_image_type_field(
                color_mode, fonts, field, layer, text
            )
            excluded_layers.append(layer.layer_id)
            layer_images.append((field, layer, layer_image))
        elif PSDLayer(layer.kind) is PSDLayer.PIXEL:
            layer_image = None
            if is_url(input_value):
                request_url = urlopen(input_value)
                image_stream = BytesIO(request_url.read())
                layer_image = Image.open(image_stream)
            elif re.search(BASE64_IMAGE_PATTERN, input_value):
                image_data = re.sub('^data:image/.+;base64,', '', input_value)
                layer_image = Image.open(BytesIO(base64.b64decode(image_data)))
            else:
                layer_image = Image.open(input_value)
            excluded_layers.append(layer.layer_id)
            layer_images.append((field, layer, layer_image))

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


def __get_field_value(field, content_values):
    value = field[TEMPLATE_KEY_INPUT_FIELD_VALUE]
    value = re.sub(
        TEMPLATE_REPLACE_PATTERN,
        lambda match: content_values[match.group(1)],
        value
    )
    return value


def __get_image_type_field(color_mode, fonts, field,
                           layer, text, default_font=DEFAULT_RENDER_FONT):
    text_properties = get_text_layer_properties(layer)
    font_name, font_size, fill_color = text_properties
    font = None
    try:
        font = fonts.get(
            text_properties[0],
            ImageFont.truetype(font_name + '.ttf', round(font_size))
        )
    except OSError:
        font = None

    if not font:
        try:
            font = fonts.get(
                text_properties[0],
                ImageFont.truetype(font_name + '.otf', round(font_size))
            )
        except OSError:
            if not default_font:
                raise FontNotFoundError(font_name)
    if not font:
        try:
            font = fonts.get(
                text_properties[0],
                ImageFont.truetype(default_font + '.ttf', round(font_size))
            )
        except OSError:
            raise FontNotFoundError(default_font)


    fonts[text_properties[0]] = font
    return render_text(color_mode, text, font, fill_color)


def __apply_text_layer_filter(text_layer, text):
    """Return text with layer properties, applying uppercase,
    lowercase or capitalize.
    """
    filtered_text = text
    char_sequence_case = CharSequenceCase.get_char_sequence_case(
        text_layer.text
    )
    if char_sequence_case:
        filtered_text = char_sequence_case(text)
    return filtered_text


def __get_text_poisition_by_aligment(text_layer, layer_image):
    """Return text position based o original alignment."""
    justification = TextLayerAlignment.get_text_layer_alignment(text_layer)
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
