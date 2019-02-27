from enum import Enum
from pathlib import Path
from psd_tools import PSDImage, compose

from .constants import *
from .view_psd_layers import get_all_psd_layers
from .render_psd import ColorMode
from .util import get_psd_or_raise


class PSDLayer(str, Enum):
    """Possible PSD Layer types."""

    GROUP = 'group'
    TYPE = 'type'
    PIXEL = 'pixel'


def create_template(file, layer_values=None, excluded_layers=tuple()):
    """Create psdtemplater standard template.

    :param file: PSD file path
    :type file: str
    :param layer_values: Content of the layers that will be replaced
    when template is executed.
    :type file: (int, str)
    :param exclude_layers: ID of layers that must will not be replaced.
    :type tree: tuple(int,...)
    """
    psd = get_psd_or_raise(file)
    if layer_values and not isinstance(layer_values, dict):
        raise TypeError('\'layer_values\' must be a dict.')
    layer_values = dict() if not layer_values else layer_values

    file_path = Path(file)
    template = {}
    template[TEMPLATE_KEY_NAME] = file_path.stem
    template[TEMPLATE_KEY_PSD_FILE] = str(file_path.resolve())
    template[TEMPLATE_KEY_PSD_COLOR_MODE] = ColorMode[psd.color_mode]
    template[TEMPLATE_KEY_IMAGE_SIZE] = psd.size
    input_fields = []
    layers = get_all_psd_layers(psd)
    for layer in layers:
        if PSDLayer(layer.kind) is not PSDLayer.GROUP \
                and layer.layer_id not in excluded_layers:
            input_field = {}
            input_field[TEMPLATE_KEY_INPUT_FIELD_LAYER_ID] = layer.layer_id
            input_field[TEMPLATE_KEY_INPUT_FIELD_TYPE] = PSDLayer(layer.kind)
            field_value = layer_values.get(layer.layer_id, layer.name)
            field_value = '{{' + field_value + '}}'
            input_field[TEMPLATE_KEY_INPUT_FIELD_VALUE] = field_value
            input_field[TEMPLATE_KEY_INPUT_FIELD_POSITION] = layer.offset
            input_field[TEMPLATE_KEY_INPUT_FIELD_SIZE] = layer.size
            input_fields.append(input_field)

    template[TEMPLATE_KEY_INPUT_FIELDS] = input_fields
    return template
