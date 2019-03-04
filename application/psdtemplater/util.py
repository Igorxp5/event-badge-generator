from pathlib import Path
from psd_tools import PSDImage


def get_psd_or_raise(file):
    """Return if a path is a psd file.

    :param file: path to file
    :type file: str
    """
    file_path = Path(file)
    if not file_path.is_file():
        raise RuntimeError('The path is not a file.')
    if not file_path.exists():
        raise RuntimeError('File doesn\'t exist.')
    try:
        return PSDImage.open(file)
    except:
        raise RuntimeError('The path must be a PSD file.')
