import React, { Component } from "react";
import { Classes, Tree } from "@blueprintjs/core";
import _ from "lodash";
import StorageManager from "../../Storage/storageManager";

class Explorer extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager("Storage Manager");
    this.StorageData = this.Storage.getFilesArray();
    this.state = {
      nodes: [],
      seletedFile: "",
      seletedFolder: ""
    };
  }
  componentDidMount = () => {
    this.setState({ nodes: this.makeTree(this.StorageData) }, () => {
      this.updateNodes();
    });
  };
  render() {
    return (
      <Tree
        contents={this.state.nodes}
        onNodeClick={this.handleNodeClick}
        onNodeDoubleClick={this.handleNodeDoubleClick}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
        className={Classes.ELEVATION_0}
      ></Tree>
    );
  }
  updateNodes = async () => {
    const oldStorage = this.StorageData;
    const newStorage = this.Storage.getFilesArray();
    if (!_.isEqual(oldStorage, newStorage)) {
      this.StorageData = newStorage;
      this.setState({ nodes: this.makeTree(this.StorageData) });
    }
    setTimeout(() => {
      this.updateNodes();
    }, 500);
  };
  makeTree = filesPathArray => {
    return listToTree(filesPathArray);
  };

  handleNodeClick = (nodeData, _nodePath, e) => {
    const originallySelected = nodeData.isSelected;
    const selectedType = nodeData.type;
    const selectedPath = nodeData.path;
    if (!e.shiftKey) {
      this.forEachNode(this.state.nodes, n => (n.isSelected = false));
    }
    nodeData.isSelected =
      originallySelected == null ? true : !originallySelected;
    if (selectedType == "file") {
      this.setState({ seletedFile: selectedPath, selectedFolder: "" });
    }
    if (selectedType == "folder") {
      if (selectedPath != this.state.seletedFolder) {
        this.setState({ seletedFolder: selectedPath, seletedFile: "" });
      } else {
        this.setState({ seletedFolder: "" });
      }
    }
  };
  handleNodeDoubleClick = (nodeData, _nodePath, e) => {
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
const listToTree = files => {
  let newFiles = files;
  let fileIndex = 0;
  let folderIndex = -1;
  return newFiles
    .map(file => file.split("/")) // "folder/folder/file=>[folder],[folder],[file]"
    .reduce((out, path) => {
      // current output, current path
      let top = out;
      while (path.length > 0) {
        let node = path.shift();
        if (top.findIndex(n => n.label === node) === -1) {
          top.push({
            label: node,
            id: fileIndex
          });
        }

        let index = top.findIndex(n => n.label === node);
        if (path.length > 0) {
          top[index].id = folderIndex;
          folderIndex--;
          top[index].type = "folder";
          top[index].icon = "folder-open";
          top[index].path = files[fileIndex]
            .slice(0, files[fileIndex].lastIndexOf("/"))
            .toString();
          top[index] = top[index] || {};
          top[index].childNodes = top[index].childNodes || [];
          top[index].childNodes.push({
            label: path[0],
            id: fileIndex
          });
          top = top[index].childNodes;
        } else {
          top[index].type = "file";
          top[index].icon = "document";
          top[index].path = files[fileIndex];
        }
      }
      fileIndex++;
      return out;
    }, []);
};

export default Explorer;
