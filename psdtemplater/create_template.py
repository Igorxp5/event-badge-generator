from pathlib import Path
from psd_tools import PSDImage, compose

from .constants import *
from .render_psd import ColorMode
from .util import get_psd_or_raise
from .view_psd_layers import get_layer_parents, get_psd_layers_dict
from .classes import PSDLayer, TextLayerAlignment, CharSequenceCase, FontStyle
from .exceptions import UsageColisionError, LayerIDNotFoundError,\
    InvalidLayerTypeError


def create_template(file, input_layers, title=None, excluded_layers=tuple()):
    """Create psdtemplater standard template.

    :param file: PSD file path
    :type file: str
    :param input_layers: Layers that will be used as input along with
    content of the layers that will be replaced when template is executed.
    :type input_layers: {int: str, ...}
    :param title: Template title.
    :type title: str
    :param exclude_layers: ID layers that mustn't be included to image.
    :type tree: tuple(int,...)
    """
    file_path = Path(file)
    psd = get_psd_or_raise(file)
    if input_layers and not isinstance(input_layers, dict):
        raise TypeError('\'input_layers\' must be a dict.')
    input_layers = dict() if not input_layers else input_layers

    if not title:
        title = file_path.stem

    template = {}
    template[TEMPLATE_KEY_TITLE] = title
    template[TEMPLATE_KEY_PSD_FILE] = str(file_path.resolve())
    template[TEMPLATE_KEY_PSD_COLOR_MODE] = ColorMode[psd.color_mode]
    template[TEMPLATE_KEY_IMAGE_SIZE] = psd.size
    input_fields = []
    layers = get_psd_layers_dict(psd)
    for layer_id, value in input_layers.items():
        try:
            layer = layers[layer_id]
        except KeyError:
            raise LayerIDNotFoundError(layer_id)

        layer_parent_ids = [p.layer_id for p in get_layer_parents(psd, layer)]

        layer_type = PSDLayer(layer.kind)
        if layer_type is PSDLayer.GROUP:
            raise InvalidLayerType(
                'Can\'t use a group type layer as input field.'
            )
        if layer.layer_id in excluded_layers \
                or any((p_id in excluded_layers for p_id in layer_parent_ids)):
            raise UsageColisionError(
                'Can\'t use input field as a excluded layer or '
                'that has a excluded parent.'
            )

        input_field = {}
        input_field[TEMPLATE_KEY_INPUT_FIELD_LAYER_ID] = layer.layer_id
        input_field[TEMPLATE_KEY_INPUT_FIELD_TYPE] = PSDLayer(layer.kind)
        field_value = input_layers.get(layer.layer_id, layer.name)
        field_value = '{{' + field_value + '}}'
        input_field[TEMPLATE_KEY_INPUT_FIELD_VALUE] = field_value
        input_field[TEMPLATE_KEY_INPUT_FIELD_POSITION] = layer.offset
        input_field[TEMPLATE_KEY_INPUT_FIELD_SIZE] = layer.size

        input_field[TEMPLATE_KEY_INPUT_FIELD_TYPE_PROPERTIES] = {}
        if layer_type is PSDLayer.TYPE:
            font_name, font_size, fill_color = get_text_layer_properties(layer)
            alignment = TextLayerAlignment.get_text_layer_alignment(layer)
            font_styles = FontStyle.get_font_styles(layer)
            char_case = CharSequenceCase.get_char_sequence_case(layer.text)
            input_field[TEMPLATE_KEY_INPUT_FIELD_TYPE_PROPERTIES] = {
                TEMPLATE_KEY_INPUT_FIELD_TEXT_FONT: font_name,
                TEMPLATE_KEY_INPUT_FIELD_TEXT_FONT_SIZE: font_size,
                TEMPLATE_KEY_INPUT_FIELD_TEXT_ALIGNMENT: alignment,
                TEMPLATE_KEY_INPUT_FIELD_TEXT_FONT_STYLE: font_styles,
                TEMPLATE_KEY_INPUT_FIELD_TEXT_CHAR_CASE: char_case,
            }

        input_fields.append(input_field)

    # Check if all excluded_layers exists.
    for layer_id in excluded_layers:
        if layer_id not in layers:
            raise LayerIDNotFoundError(layer_id)

    template[TEMPLATE_KEY_INPUT_FIELDS] = input_fields
    template[TEMPLATE_KEY_EXCLUDED_LAYERS] = excluded_layers
    return template


def get_text_layer_properties(text_layer):
    """Get properties of text layer: Font name, Font size,
    Text Alignment and Fill color.
    """
    fontset = text_layer.resource_dict['FontSet']
    rundata = text_layer.engine_dict['StyleRun']['RunArray']
    stylesheet = rundata[0]['StyleSheet']['StyleSheetData']
    font_size = stylesheet['FontSize']
    fill_color = stylesheet['FillColor']['Values']
    fill_color = tuple([int(fill_color[i] * 255) for i in range(1, 3 + 1)])
    fill_color += (int(stylesheet['FillColor']['Values'][0] * 255),)
    font_name = str(fontset[stylesheet['Font']]['Name'])[1:-1]
    return (font_name, float(font_size), fill_color)
