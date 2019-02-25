"""CLI to generate event badges from PSD templates."""

__author__ = 'Igor Fernandes'
__version__ = '0.0.0'

import click
from commands import view_psd_layers


@click.group()
@click.version_option(version=__version__)
def cli():
    """CLI to generate event badges from PSD templates."""
    pass

cli.add_command(view_psd_layers)

if __name__ == '__main__':
    cli()
