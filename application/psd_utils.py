import base64
from io import BytesIO
from psd_tools import PSDImage
from .utils import get_base64_from_pil_image
from .psdtemplater import PSDLayer, render_layer, get_all_psd_layers,\
    get_text_layer_properties


def getPSD(psd_file):
    """Return PSDImage object."""
    return PSDImage.open(psd_file)


def get_psd_fonts(psd):
    """Get list of fonts from a PSD file."""
    layers = get_all_psd_layers(psd)
    fonts = []
    for layer in layers:
        if PSDLayer(layer.kind) is PSDLayer.TYPE:
            font = get_text_layer_properties(layer)[0]
            fonts.append(font)
    return fonts


def get_editable_psd_layers(psd_file_path):
    """Return a list of the psd layers that can be edited.
    Each list item contains id, name, type and base64 image.
    """
    psd = getPSD(psd_file_path)
    all_psd_layers = get_all_psd_layers(psd)
    editable_types = (
        PSDLayer.TYPE, PSDLayer.PIXEL, PSDLayer.SHAPE,
        PSDLayer.SMART_OBJECT, PSDLayer.PSD_IMAGE
    )
    editable_psd_layers = []
    for layer in all_psd_layers:
        id_ = layer.layer_id
        name = layer.name
        type_ = PSDLayer(layer.kind)
        if type_ in editable_types:
            image_buffer = BytesIO()
            layer_image = render_layer(
                psd_file_path, id_, original_size=False
            )
            image_data = get_base64_from_pil_image(layer_image)
            editable_psd_layers.append({
                'id': id_,
                'name': name,
                'type': type_,
                'image_data': image_data
            })
    return editable_psd_layers
