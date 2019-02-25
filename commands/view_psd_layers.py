"""View layers tree of a PSD file."""

__author__ = 'Igor Fernandes'
__version__ = '0.0.0'

import click
import treelib
from psd_tools import PSDImage
from collections.abc import Iterable


@click.command('view-psd-layers')
@click.argument('file', type=click.Path(exists=True, dir_okay=False))
def view_psd_layers(file):
    """View layers tree of a PSD file."""
    try:
        psd = PSDImage.open(file)
    except:
        raise click.FileError(file, 'Expected a file in PSD format.')

    def add_layers_to_tree(tree, layers):
        if isinstance(layers, Iterable):
            for layer in layers:
                layer_type = layer.__class__.__name__
                layer.tree_alias = layer.layer_id
                exhibition = (f'{layer.name}' +
                              f'(Id: {layer.layer_id}, Type={layer_type})')
                tree.create_node(exhibition, layer.layer_id,
                                 parent=layers.tree_alias)
                add_layers_to_tree(tree, layer)
    
    psd.tree_alias = 'psd'
    tree = treelib.Tree()
    tree.create_node(f'PSD: {file}', psd.tree_alias)
    add_layers_to_tree(tree, psd)
    tree.show()
