import re
import os
import sys
from pathlib import Path


def get_os_font_dirs():
    """Return possible directories where can be found OS fonts.

    Code extracted from Pillow lib 5.4.1. File: src/PIL/ImageFont.py
    """
    dirs = []
    if sys.platform == "win32":
        # check the windows font repository
        # NOTE: must use uppercase WINDIR, to work around bugs in
        # 1.5.2's os.environ.get()
        windir = os.environ.get("WINDIR")
        if windir:
            dirs.append(os.path.join(windir, "fonts"))
    elif sys.platform in ('linux', 'linux2'):
        lindirs = os.environ.get("XDG_DATA_DIRS", "")
        if not lindirs:
            # According to the freedesktop spec, XDG_DATA_DIRS should
            # default to /usr/share
            lindirs = '/usr/share'
        dirs += [os.path.join(l, "fonts") for l in lindirs.split(":")]
    elif sys.platform == 'darwin':
        dirs += ['/Library/Fonts', '/System/Library/Fonts']
        dirs += [os.path.expanduser('~/Library/Fonts')]
    return [Path(dir_) for dir_ in dirs]


def get_system_ttf_font_files():
    """Return list with all system ttf fonts."""
    fonts_dir = get_os_font_dirs()
    return [f for d in fonts_dir for f in os.listdir(d) if f.endswith('.ttf')]


def get_system_ttf_dict():
    """Return a dict with all ttf fonts names capitalized as key
    and file name as value.
    """
    fonts = {}
    ttf_fonts = get_system_ttf_font_files()
    for ttf in ttf_fonts:
        font_name = filter_font_name(ttf)
        fonts[font_name] = ttf
    return fonts


def filter_font_name(font_name):
    """Returns the font name in a more presentable way."""
    font_name = re.sub('.ttf|Demo|demo|trial', '', font_name)
    font_name = font_name.replace('-', ' ').strip()
    font_name = font_name[0].upper() + font_name[1:]
    return font_name
