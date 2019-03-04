import treelib
from pathlib import Path
from psd_tools import PSDImage
from collections.abc import Iterable

from .util import get_psd_or_raise


def view_psd_layers(file):
    """View layers tree of a PSD file.

    :param file: PSD file path
    :type file: str
    """
    psd = get_psd_or_raise(file)
    tree = get_psd_layers_tree(psd)
    tree.show(key=lambda node: node.data[0], reverse=True)


def get_psd_layers_tree(psd):
    """Get ordered tree of layers from a PSD and save it into
    PSDImage object.

    :param psd: PSD which will be extracted the layers.
    :type tree: psd_tools.PSDImage or psd_tools.api.layers

    :param root_name: Tree root name.
    :type root_name: str
    :default root_name: psd.name
    """
    if psd.__dict__.get('tree'):
        return psd.tree

    psd.tree_alias = 'psd'
    tree = treelib.Tree()
    tree.create_node(psd.name, psd.tree_alias, data=(0, psd))
    __add_layers_to_tree(tree, psd)
    psd.tree = tree
    return tree


def get_layer_parents(psd, layer):
    """Get list of all layer parents.

    :param psd: PSD which will be extracted the layers.
    :type tree: psd_tools.PSDImage or psd_tools.api.layers
    :param layer: Layer.
    :type layer: psd_tools.api.layers.Layer
    """
    tree = get_psd_layers_tree(psd)

    def get_parents(tree, layer_):
        node = tree.get_node(layer_.tree_alias)
        parent_node = tree.parent(node.identifier)
        if node.is_root() or parent_node.is_root():
            return []
        parent_layer = parent_node.data[1]
        return [parent_layer] + get_parents(tree, parent_layer)

    return get_parents(tree, layer)


def get_all_psd_layers(psd):
    """Get all layers of a PSD into a list. This function
    save a cache tree into PSDImage object.

    :param psd: PSD which will be extracted the layers.
    :type tree: psd_tools.PSDImage or psd_tools.api.layers
    """
    tree = get_psd_layers_tree(psd)
    return [n.data[1] for n in tree.all_nodes_itr() if not n.is_root()]


def get_psd_layers_dict(psd):
    """Get all layers of a PSD into a dictionary. This function
    save a cache tree into PSDImage object.

    :param psd: PSD which will be extracted the layers.
    :type tree: psd_tools.PSDImage or psd_tools.api.layers
    """
    tree = get_psd_layers_tree(psd)
    nodes = tree.all_nodes_itr()
    return {n.data[1].layer_id: n.data[1] for n in nodes if not n.is_root()}


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
            tree.create_node(exhibition, layer.layer_id, data=(index, layer),
                             parent=layers.tree_alias)
            __add_layers_to_tree(tree, layer)
