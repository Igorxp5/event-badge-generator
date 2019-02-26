import treelib
from pathlib import Path
from psd_tools import PSDImage
from collections.abc import Iterable


def view_psd_layers(file, validate_args=True):
    """View layers tree of a PSD file."""
    if validate_args:
        __view_psd_layers_validation(file)
    try:
        psd = PSDImage.open(file)
    except:
        raise RuntimeError('Expected a file in PSD format.')

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
    __add_layers_to_tree(tree, psd)
    return tree


def __add_layers_to_tree(tree, layers):
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
            __add_layers_to_tree(tree, layer)


def __view_psd_layers_validation(file):
    file_path = Path(file)
    if not file_path.is_file() or not file_path.exists():
        raise RuntimeError('The path must be a PSD file.')
