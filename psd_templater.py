"""CLI to generate PSD templates and render them
passing values to the fields.
"""

__author__ = 'Igor Fernandes'
__version__ = '0.0.0'

import click
import psdtemplater
from pathlib import Path


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
        psdtemplater.view_psd_layers(file)
    except psdtemplater.FileError as e:
        raise click.FileError(e.file, e.message)


@click.command('render-psd')
@click.argument('file', required=True,
                type=click.Path(exists=True, dir_okay=False))
@click.argument('output', default='.', type=click.Path())
@click.option('-el', '--exclude-layer',
              type=int, multiple=True,
              help='Layer ID that will not be redered. '
              'Run \'view-psd-layers\' command to see id of each layer. '
              'This option can be called more than once to add more layers.')
@click.option('--original-size/--no-original-size', default=True,
              help='Don\'t keep width and height equals to PSD.')
def __render_psd(file, output, exclude_layer, original_size):
    """Compose PSD to one of the following formats: png, pdf."""
    image = psdtemplater.render_psd(file, exclude_layer,
                                    original_size=original_size)
    file_path = Path(file)
    output_path = Path(output)
    if output_path.is_dir():
        filaname = (file_path.stem + '.' +
                    psdtemplater.DEFAULT_OUTPUT_FILE_EXTENSION)
        output_path = output_path.joinpath(filaname)
    else:
        file_extension = output_path.suffix[1:]
        if file_extension not in psdtemplater.AVAILABLE_OUTPUT_FILE_EXTENSIONS:
            raise click.UsageError('Invalid file extension.')

    image.save(output_path)


__cli.add_command(__view_psd_layers)
__cli.add_command(__render_psd)

if __name__ == '__main__':
    __cli()
