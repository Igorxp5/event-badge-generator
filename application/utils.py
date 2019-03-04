import base64
from io import BytesIO


def get_base64_from_pil_image(image):
    """Return a PNG Base 64 Image from a PIL Image Object."""
    image_buffer = BytesIO()
    image.save(image_buffer, format='PNG')
    image_data = base64.b64encode(image_buffer.getvalue())
    image_data = image_data.decode('ascii')
    return 'data:image/png;base64,' + image_data
