import treelib
from enum import Enum
from pathlib import Path
from psd_tools import PSDImage, compose
from PIL import Image, ImageDraw, ImageFont, ImageChops

from .view_psd_layers import get_all_psd_layers
from .util import get_psd_or_raise


class ColorMode(str, Enum):
    """Enum converter between PSD Color Mode to PIL Color Mode."""

    BITMAP = '1',
    GRAYSCALE = 'L',
    CMYK = 'CMYK',
    LAB = 'LAB',
    RGB = 'RGBA'


def render_psd(file, excluded_layers=tuple(),
               original_size=False):
    """Render a PSD file into PIL Image.

    :param file: File path to PSD Image.
    :type file: str
    :param exclude_layers: ID layers that mustn't be included to image.
    :type tree: tuple(int,...)
    :param original_size: Keep original PSD size flag.
    :type original_size: bool
    """
    psd = get_psd_or_raise(file)

    layers = get_all_psd_layers(psd)

    if excluded_layers:
        for layer in layers:
            if layer.layer_id in excluded_layers:
                layer.visible = False

    return __compose_layers(psd, layers, original_size)


def __compose_layers(psd, layers, original_size):
    """Compose layers into a PIL.Image."""
    color_mode = ColorMode[psd.color_mode]
    size = size = psd.size
    if not original_size:
        width, height = 0, 0
        for layer in layers:
            if layer.is_visible():
                width = layer.width if layer.width > width else width
                height = layer.height if layer.height > height else height
        size = width, height

    left, top = 0, 0
    for layer in layers:
        if layer.is_visible():
            top = layer.top if layer.top < top else top
            left = layer.left if layer.left < left else left
    offset = (left, top)

    root_image = Image.new(color_mode.value, size, (0, 0, 0, 0))
    reversed_layers = layers.copy()
    reversed_layers.reverse()
    layers_compose = compose(
        layers=reversed_layers,
        layer_filter=lambda layer: layer.is_visible()
    )
    insert_pil_image(root_image, layers_compose, offset)
    return root_image


def insert_pil_image(to_image, from_image, position):
    """Insert a PIL.Image into another PIL.Image, passing position.

    :param to_image: Base image to where \'from_image\' will be placed.
    :type to_image: PIL.Image
    :param from_image: Image that will be placed.
    :type from_image: PIL.Image
    :param position: Position of \'from_image\' into \'to_image\'.
    :type position: (int, int)
    """
    from_image = from_image.convert(to_image.mode)
    top, left = position
    dest = (max(0, top), max(0, left))
    source = (abs(min(0, top)), abs(min(0, left)))
    to_image.alpha_composite(from_image, dest, source)


def render_text(color_mode, text, font, fill):
    """Render a text to PIL Image passing font and fill color.

    :param color_mode: Color Mode of Image.
    :type color_mode: ColorMode
    :param text: Text content.
    :type text: str
    :param font: Text font.
    :type font: PIL.ImageFont
    :param fill: Fill color to the text.
    :type fill: (int, int, int, int)
    """
    text_image = Image.new(color_mode.value, font.getsize(text), (0, 0, 0, 0))
    draw_context = ImageDraw.Draw(text_image)
    draw_context.text((0, 0), text, font=font, fill=fill)
    return text_image.crop(text_image.getbbox())
