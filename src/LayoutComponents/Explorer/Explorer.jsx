import React, { Component } from "react";
import { Classes, Tree } from "@blueprintjs/core";

import StorageManager from "../../Storage/storageManager";

class Explorer extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager("Storage Manager");
    this.state = { nodes: this.makeTree(this.Storage.getFilesArray()) };
  }
  render() {
    return (
      <Tree
        contents={this.state.nodes}
        onNodeClick={this.handleNodeClick}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
        className={Classes.ELEVATION_0}
      ></Tree>
    );
  }

  makeTree = filesPathArray => {
    return arrangeIntoTree(filesPathArray);
  };

  handleNodeClick = (nodeData, _nodePath, e) => {
    console.log(nodeData);
    const originallySelected = nodeData.isSelected;
    if (!e.shiftKey) {
      this.forEachNode(this.state.nodes, n => (n.isSelected = false));
    }
    nodeData.isSelected =
      originallySelected == null ? true : !originallySelected;
    if (nodeData.type == "file") {
      this.props.openFile(nodeData.path);
    }
    this.setState(this.state);
  };
  handleNodeCollapse = nodeData => {
    nodeData.isExpanded = false;
    this.setState(this.state);
  };

  handleNodeExpand = nodeData => {
    nodeData.isExpanded = true;
    this.setState(this.state);
  };
  forEachNode = (nodes, callback) => {
    if (nodes == null) {
      return;
    }

    for (const node of nodes) {
      callback(node);
      this.forEachNode(node.childNodes, callback);
    }
  };
}

const arrangeIntoTree = paths => {
  let pathArray = [];
  paths.forEach(filePath => {
    pathArray.push(filePath.split("/"));
  });

  let tree = [];

  for (let i = 0; i < pathArray.length; i++) {
    // foreach path
    let path = pathArray[i];
    let currentLevel = tree; //current path level
    for (let j = 0; j < path.length; j++) {
      // foreach level inside path exmple : "/" "root" "home" "file"
      const part = path[j];

      const existingPath = findWhere(currentLevel, "name", part); // check for previous folder hits

      if (existingPath) {
        // if path all ready exist
        currentLevel = existingPath.childNodes;
      } else {
        let newPart = {
          name: part,
          path: paths[i],
          childNodes: []
        };

        currentLevel.push(newPart);
        currentLevel = newPart.childNodes;
      }
    }
  }
  return makeType(tree);
};

const makeType = (tree, startIdIndex = 0, child = false) => {
  let idIndex = startIdIndex;
  if (child) {
    tree.id = idIndex;
    idIndex++;
  }
  for (let elementIndex = 0; elementIndex < tree.length; elementIndex++) {
    tree[elementIndex].id = idIndex;
    tree[elementIndex].label = tree[elementIndex].name;
    if (tree[elementIndex].childNodes.length != 0) {
      tree[elementIndex].type = "folder";
      tree[elementIndex].icon = "folder-close";
      tree[elementIndex].childNodes = makeType(
        tree[elementIndex].childNodes,
        idIndex + 1,
        true
      );
    } else {
      tree[elementIndex].type = "file";
      tree[elementIndex].icon = "document";
      delete tree[elementIndex].childNodes;
    }
    idIndex++;
  }
  return tree;
};

const findWhere = (array, key, value) => {
  let t = 0;
  while (t < array.length && array[t][key] !== value) {
    t++;
  }

  if (t < array.length) {
    return array[t];
  } else {
    return false;
  }
};

export default Explorer;
