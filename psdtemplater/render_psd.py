import treelib
from enum import Enum
from pathlib import Path
from psd_tools import PSDImage, compose
from PIL import Image, ImageDraw, ImageFont, ImageChops

from .view_psd_layers import get_all_psd_layers


class ColorMode(Enum):
    """Enum converter between PSD Color Mode to PIL Color Mode."""

    BITMAP = '1',
    GRAYSCALE = 'L',
    CMYK = 'CMYK',
    LAB = 'LAB',
    RGB = 'RGBA'


def render_psd(file, excluded_layers=tuple(),
               original_size=False, validate_args=True):
    """Render a PSD file into PIL Image.

    :param file: File path to PSD Image.
    :type: str
    :param exclude_layers: ID layers that mustn't be included to image.
    :type tree: tuple(int,...)
    :param original_size: Keep original PSD size flag.
    :type bool
    """
    if validate_args:
        __render_psd_validation(file, excluded_layers)

    file_path = Path(file)
    psd = PSDImage.open(file_path)
    layers = get_all_psd_layers(psd)

    if excluded_layers:
        for layer in layers:
            if layer.layer_id in excluded_layers:
                layer.visible = False

    return __compose_layers(psd, layers, original_size)


def __compose_layers(psd, layers, original_size):
    """Compose layers into a PIL.Image."""
    color_mode = ColorMode.__dict__[psd.color_mode]
    size = size = psd.size
    if not original_size:
        width, height = 0, 0
        for layer in layers:
            if layer.is_visible():
                width = layer.width if layer.width > width else width
                height = layer.height if layer.height > height else height
        size = width, height
    root_image = Image.new(color_mode.value, size, (0, 0, 0, 0))
    reversed_layers = layers.copy()
    reversed_layers.reverse()
    layers_compose = compose(
        layers=reversed_layers,
        layer_filter=lambda layer: layer.is_visible()
    )
    __insert_pil_image(root_image, layers_compose, (0, 0))
    return root_image


def __insert_pil_image(to_image, from_image, position):
    from_image = from_image.convert(to_image.mode)
    top, left = position
    dest = (max(0, top), max(0, left))
    source = (abs(min(0, top)), abs(min(0, left)))
    to_image.alpha_composite(from_image, dest, source)


def __render_psd_validation(file, exclude_layer):
    file_path = Path(file)
    if not file_path.is_file() or not file_path.exists():
        raise RuntimeError('The path must be a PSD file.')
