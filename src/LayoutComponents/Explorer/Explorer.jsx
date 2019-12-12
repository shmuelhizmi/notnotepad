import React, { Component } from "react";
import { Classes, Tree, Button, ButtonGroup } from "@blueprintjs/core";
import _ from "lodash";
import CreateFile from "./Action/Create";
import DeleteFile from "./Action/Delete";
import RenameFile from "./Action/Rename";
import Scrollbars from "react-custom-scrollbars";
import StorageManager, { codeDir } from "../../Storage/storageManager";

class Explorer extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager();
    this.state = {
      nodes: null,
      seletedFile: "",
      seletedFolder: "",
      createFileDialogIsOpen: false,
      deleteFileDialogIsOpen: false,
      renameFileDialogIsOpen: false
    };
  }
  componentDidMount = () => {
    this.updateNodes();
  };
  render() {
    return (
      <>
        <ButtonGroup fill minimal>
          <Button icon="refresh" onClick={this.updateNodes}></Button>
          <Button icon="add" onClick={this.openCreateFileDialog}></Button>
          <Button
            onClick={this.OpenRenameFileDialog}
            icon="text-highlight"
          ></Button>
          <Button onClick={this.openDeleteFileDialog} icon="remove"></Button>
        </ButtonGroup>
        <Scrollbars style={{ height: "95%" }}>
          <Tree
            contents={this.state.nodes}
            onNodeClick={this.handleNodeClick}
            onNodeDoubleClick={this.handleNodeDoubleClick}
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand}
            className={Classes.ELEVATION_0}
          ></Tree>
        </Scrollbars>
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
    this.updateNodes();
    this.setState({ createFileDialogIsOpen: false });
  };
  OpenRenameFileDialog = () => {
    this.setState({ renameDialogIsOpen: true }, () => {});
  };
  closeRenameFileDialog = () => {
    this.updateNodes();
    this.setState({ renameDialogIsOpen: false });
  };
  openDeleteFileDialog = () => {
    if (this.state.seletedFile) {
      this.setState({ deleteFileDialogIsOpen: true });
    }
  };
  closeDeleteFileDialog = () => {
    this.updateNodes();
    this.setState({ deleteFileDialogIsOpen: false });
  };

  updateNodes = () => {
    this.makeTree().then(tree => {
      setTimeout(() => {
        if (!_.isEqual(tree, this.state.nodes)) {
          this.setState({ nodes: tree });
        }
      }, 2);
    });
  };

  makeTree() {
    const getName = path => {
      return path.slice(path.lastIndexOf("/") + 1, path.length);
    };
    const makeLevel = (path, storage, id = 0) => {
      return new Promise((resolve, reject) => {
        this.Storage.listDirectoryToCategories(path, storage)
          .then(level => {
            let levelTree = [];
            level.forEach(async (file, index) => {
              const currentID = index + id;
              if (file.isDirectory) {
                levelTree.push({
                  id: currentID,
                  label: getName(file.path),
                  path: file.path,
                  type: "folder",
                  icon: "folder-open",
                  childNodes: await makeLevel(
                    file.path + "/",
                    codeDir,
                    currentID + 1
                  )
                });
              } else {
                levelTree.push({
                  id: currentID,
                  label: getName(file.path),
                  path: file.path,
                  type: "file",
                  icon: "document"
                });
              }
            });

            resolve(levelTree);
          })
          .catch(reject);
      });
    };
    return new Promise((resolve, reject) => {
      makeLevel("", codeDir)
        .then(res => {
          resolve(res);
        })
        .catch(reject);
    });
  }
  handleNodeClick = (nodeData, _nodePath, e) => {
    const originallySelected = nodeData.isSelected;
    const selectedType = nodeData.type;
    const selectedPath = nodeData.path;
    if (!e.shiftKey) {
      this.forEachNode(this.state.nodes, n => (n.isSelected = false));
    }
    nodeData.isSelected =
      originallySelected == null ? true : !originallySelected;
    if (selectedType === "file") {
      this.setState({ seletedFile: selectedPath, selectedFolder: "" });
    }
    if (selectedType === "folder") {
      if (selectedPath !== this.state.seletedFolder) {
        this.setState({ seletedFolder: selectedPath, seletedFile: "" });
      } else {
        this.setState({ seletedFolder: "" });
      }
    }
  };
  handleNodeDoubleClick = (nodeData, _nodePath, e) => {
    if (nodeData.type === "file") {
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

export default Explorer;
