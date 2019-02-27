from pathlib import Path


def raise_if_not_psd_file(file):
    """Return if a path is a psd file.

    :param file: path to file
    :type file: str
    """
    file_path = Path(file)
    if not file_path.is_file():
        raise RuntimeError('The path is not a file.')
    if not file_path.exists():
        raise RuntimeError('File doesn\'t exist.')
    if file_path.suffix != '.psd':
        raise RuntimeError('The path must be a PSD file.')