"""psd_templater.py

This package provides tools to generate templates from a PSD file
to render from it PNG, PDF or JPG files changing some field defined
in the template. Rendering can be done in bulk through a CSV or JSON file.
"""

__author__ = 'Igor Fernandes'
__version__ = '0.0.0'

from .view_psd_layers import view_psd_layers, get_psd_layers_tree
from .render_psd import render_psd
from .exceptions import FileError
