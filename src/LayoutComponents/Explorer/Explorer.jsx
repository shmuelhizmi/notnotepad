import React, { Component } from "react";
import { Classes, Tree, Drawer, Button, ButtonGroup } from "@blueprintjs/core";
import _ from "lodash";
import CreateFile from "./Action/CreateFile";
import DeleteFile from "./Action/DeleteFile";
import RenameFile from "./Action/RenameFile";
import StorageManager from "../../Storage/storageManager";

class Explorer extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager("Storage Manager");
    this.StorageData = this.Storage.getFilesArray();
    this.state = {
      nodes: [],
      seletedFile: "",
      seletedFolder: "",
      createFileDialogIsOpen: false,
      deleteFileDialogIsOpen: false,
      renameFileDialogIsOpen: false
    };
  }
  componentDidMount = () => {
    this.setState({ nodes: this.makeTree(this.StorageData) }, () => {
      this.updateNodes();
    });
  };
  render() {
    return (
      <>
        <ButtonGroup fill minimal>
          <Button icon="add" onClick={this.openCreateFileDialog}></Button>
          <Button
            onClick={this.OpenRenameFileDialog}
            icon="text-highlight"
          ></Button>
          <Button onClick={this.openDeleteFileDialog} icon="remove"></Button>
        </ButtonGroup>
        <Tree
          contents={this.state.nodes}
          onNodeClick={this.handleNodeClick}
          onNodeDoubleClick={this.handleNodeDoubleClick}
          onNodeCollapse={this.handleNodeCollapse}
          onNodeExpand={this.handleNodeExpand}
          className={Classes.ELEVATION_0}
        ></Tree>
        <div>
          <CreateFile
            key={Math.random()}
            isOpen={this.state.createFileDialogIsOpen}
            folder={this.state.seletedFolder}
            onClose={this.closeCreateFileDialog}
          ></CreateFile>
          <DeleteFile
            key={Math.random()}
            isOpen={this.state.deleteFileDialogIsOpen}
            file={this.state.seletedFile}
            onClose={this.closeDeleteFileDialog}
          ></DeleteFile>
          <RenameFile
            key={Math.random()}
            isOpen={this.state.renameDialogIsOpen}
            fileName={this.state.seletedFile}
            onClose={this.closeRenameFileDialog}
          ></RenameFile>
        </div>
      </>
    );
  }
  //actions
  openCreateFileDialog = () => {
    this.setState({ createFileDialogIsOpen: true }, () => {});
  };
  closeCreateFileDialog = () => {
    this.setState({ createFileDialogIsOpen: false });
  };
  OpenRenameFileDialog = () => {
    this.setState({ renameDialogIsOpen: true }, () => {});
  };
  closeRenameFileDialog = () => {
    this.setState({ renameDialogIsOpen: false });
  };
  openDeleteFileDialog = () => {
    if (this.state.seletedFile != "") {
      this.setState({ deleteFileDialogIsOpen: true });
    }
  };
  closeDeleteFileDialog = () => {
    this.setState({ deleteFileDialogIsOpen: false });
  };

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
