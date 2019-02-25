"""CLI to generate event badges from PSD templates."""

__author__ = 'Igor Fernandes'
__version__ = '0.0.0'

import click
from commands import viewPsdLayers


@click.group()
@click.version_option(version=__version__)
def cli():
    """CLI to generate event badges from PSD templates."""
    pass

cli.add_command(viewPsdLayers)

if __name__ == '__main__':
    cli()
