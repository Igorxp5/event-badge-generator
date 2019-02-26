"""CLI to generate PSD templates and render them
passing values to the fields.
"""

__author__ = 'Igor Fernandes'
__version__ = '0.0.0'

import click
import psdtemplater


@click.group()
@click.version_option(version=__version__)
def __cli():
    """CLI to generate PSD templates and render them
    passing values to the fields.
    """
    pass


@click.command('view-psd-layers')
@click.argument('file', type=click.Path(exists=True, dir_okay=False))
def __view_psd_layers(file):
    """View layers tree of a PSD file."""
    try:
        psdtemplater.view_psd_layers(file, validate_args=False)
    except psdtemplater.FileError as e:
        click.FileError(e.file, e.message)

__cli.add_command(__view_psd_layers)

if __name__ == '__main__':
    __cli()
