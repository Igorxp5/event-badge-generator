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

    tree = get_psd_layers_tree(psd, f'PSD: {file}')
    tree.show(key=lambda node: node.data, reverse=True)


def get_psd_layers_tree(psd, root_name=None):
    """Get ordered tree of layers from a PSD.

    :param psd: PSD which will be extracted the layers.
    :type tree: psd_tools.PSDImage or psd_tools.api.layers

    :param root_name: Tree root name.
    :type root_name: str
    :default root_name: psd.name
    """
    root_name = psd.name if not root_name else root_name
    psd.tree_alias = 'psd'
    tree = treelib.Tree()
    tree.create_node(root_name, psd.tree_alias)
    add_layers_to_tree(tree, psd)
    return tree


def add_layers_to_tree(tree, layers):
    """Add layers and sub-layers to a tree.

    :param tree: Tree to which layers will be added.
    :type tree: treelib.tree.Tree
    :param layers: PSD root or layer that will be added to the tree.
    :type layers: psd_tools.PSDImage or psd_tools.api.layers
    """
    if isinstance(layers, Iterable):
        for index in range(len(layers) - 1, -1, -1):
            layer = layers[index]
            layer_type = layer.__class__.__name__
            layer.tree_alias = layer.layer_id
            exhibition = (f'{layer.name}' +
                          f'(Id: {layer.layer_id}, Type={layer_type})')
            tree.create_node(exhibition, layer.layer_id, data=index,
                             parent=layers.tree_alias)
            add_layers_to_tree(tree, layer)