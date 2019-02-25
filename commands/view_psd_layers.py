"""View layers tree of a PSD file."""

__author__ = 'Igor Fernandes'
__version__ = '0.0.0'

import click
import treelib
from psd_tools import PSDImage
from collections.abc import Iterable


@click.command('view-psd-layers')
@click.argument('file', type=click.Path(exists=True, dir_okay=False))
def viewPsdLayers(file):
    """View layers tree of a PSD file."""
    try:
        psd = PSDImage.open(file)
    except:
        raise click.FileError(file, 'Expected a file in PSD format.')

    def addLayersToTree(tree, layers):
        if isinstance(layers, Iterable):
            for layer in layers:
                layerName = layer.name
                layerId = layer.layer_id
                layerType = layer.__class__.__name__
                layer.treeAlias = layerId
                exhibition = f'{layerName} (Id: {layerId}, Type={layerType})'
                tree.create_node(exhibition, layerId, parent=layers.treeAlias)
                addLayersToTree(tree, layer)
    
    psd.treeAlias = 'psd'
    tree = treelib.Tree()
    tree.create_node(f'PSD: {file}', psd.treeAlias)
    addLayersToTree(tree, psd)
    tree.show()
