import React, { Component } from "react";
import {
  Classes,
  Tree,
  Button,
  ButtonGroup,
  ITreeNode,
  Toaster,
  Position
} from "@blueprintjs/core";
import _ from "lodash";
import CreateFile from "./actions/Create";
import DeleteFile from "./actions/Delete";
import RenameFile from "./actions/Rename";
import Scrollbars from "react-custom-scrollbars";
import StorageManager, { codeDir } from "../../Storage/storageManager";

interface nodeData {
  path: string;
  type: string;
}
interface ExplorerState {
  nodes: ITreeNode<nodeData>[];
  openDocument: string | null;
  isOpen?: boolean;
  selected: string;
  selectedIsDirectory: boolean;
  createFileDialogIsOpen: boolean;
  deleteFileDialogIsOpen: boolean;
  renameDialogIsOpen: boolean;
}

export interface ExplorerProps {
  openFile: (path: string) => void;
  document: string;
}

class Explorer extends Component<ExplorerProps, ExplorerState> {
  storage: typeof StorageManager;
  constructor(props: ExplorerProps) {
    super(props);
    this.storage = StorageManager;
    this.state = {
      nodes: [],
      selected: "",
      openDocument: null,
      selectedIsDirectory: false,
      createFileDialogIsOpen: false,
      deleteFileDialogIsOpen: false,
      renameDialogIsOpen: false
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
            selected={this.state.selected}
            onClose={this.closeCreateFileDialog}
          ></CreateFile>
          <DeleteFile
            key={Math.random()}
            isOpen={this.state.deleteFileDialogIsOpen}
            selected={this.state.selected}
            selectedIsDirectory={this.state.selectedIsDirectory}
            onClose={this.closeDeleteFileDialog}
          ></DeleteFile>
          <RenameFile
            key={Math.random()}
            isOpen={this.state.renameDialogIsOpen}
            selected={this.state.selected}
            selectedIsDirectory={this.state.selectedIsDirectory}
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
  closeCreateFileDialog = (success: boolean) => {
    this.updateNodes();
    this.setState({ createFileDialogIsOpen: false });
  };
  OpenRenameFileDialog = () => {
    if (this.state.selected) {
      this.setState({ renameDialogIsOpen: true }, () => {});
    }
  };
  closeRenameFileDialog = (success: boolean, newName?: string) => {
    this.updateNodes();
    this.setState({ renameDialogIsOpen: false });
    if (success && newName) {
      this.setState({ selected: newName });
    }
  };
  openDeleteFileDialog = () => {
    if (
      this.state.selected &&
      this.state.selected !== this.props.document
    ) {
      this.setState({ deleteFileDialogIsOpen: true });
    } else {
      if(this.state.selected){
        Toster.show({ message: "cannot delete open file", intent: "danger" });
      }else{
        Toster.show({ message: "please select file first", intent: "danger" });
      }
    }
  };
  closeDeleteFileDialog = (success: boolean) => {
    this.updateNodes();
    this.setState({ deleteFileDialogIsOpen: false });
    if (success) {
      this.setState({ selected: "" });
    }
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
    const getName = (path: string) => {
      return path.slice(path.lastIndexOf("/") + 1, path.length);
    };
    const makeLevel = (path: string, storage: string, id: number = 0) => {
      return new Promise(
        (resolve: (nodes: ITreeNode<nodeData>[]) => void, reject) => {
          this.storage
            .listDirectoryToCategories(path, storage)
            .then(level => {
              let levelTree: ITreeNode<nodeData>[];
              levelTree = [];
              level.forEach(
                (
                  file: { path: string; isDirectory: boolean },
                  index: number
                ) => {
                  const currentID = index + id;
                  if (file.isDirectory) {
                    makeLevel(file.path + "/", codeDir, currentID + 1).then(
                      tree => {
                        levelTree.push({
                          id: currentID,
                          label: getName(file.path),
                          nodeData: { path: file.path, type: "folder" },
                          icon: "folder-open",
                          childNodes: tree
                        });
                      }
                    );
                  } else {
                    levelTree.push({
                      id: currentID,
                      label: getName(file.path),
                      nodeData: { path: file.path, type: "file" },
                      icon: "document"
                    });
                  }
                }
              );

              resolve(levelTree);
            })
            .catch(reject);
        }
      );
    };
    return new Promise(
      (resolve: (nodes: ITreeNode<nodeData>[]) => void, reject) => {
        makeLevel("", codeDir)
          .then(res => {
            resolve(res);
          })
          .catch(reject);
      }
    );
  }
  handleNodeClick = (
    nodeData: ITreeNode<nodeData>,
    _nodePath: number[],
    e: React.MouseEvent<HTMLElement>
  ) => {
    const originallySelected = nodeData.isSelected;
    if (nodeData.nodeData) {
      const selectedType = nodeData.nodeData.type;
      const selectedPath = nodeData.nodeData.path;
      if (!e.shiftKey) {
        this.forEachNode(this.state.nodes, n => (n.isSelected = false));
      }
      nodeData.isSelected =
        originallySelected == null ? true : !originallySelected;
      if (selectedType === "file") {
        this.setState({ selected: selectedPath, selectedIsDirectory: false });
      }
      if (selectedType === "folder") {
        if (selectedPath !== this.state.selected) {
          this.setState({ selected: selectedPath, selectedIsDirectory: true });
        }
      }
    }
  };
  handleNodeDoubleClick = (
    nodeData: ITreeNode<nodeData>,
    _nodePath: number[],
    e: React.MouseEvent<HTMLElement>
  ) => {
    if (nodeData.nodeData) {
      if (nodeData.nodeData.type === "file") {
        if (nodeData.nodeData.path) {
          const path = nodeData.nodeData.path;
          this.props.openFile(path);
          this.setState({ openDocument: path });
        }
      }
    }
  };
  handleNodeCollapse = (nodeData: ITreeNode<nodeData>) => {
    nodeData.isExpanded = false;
    this.setState(this.state);
  };

  handleNodeExpand = (nodeData: ITreeNode<nodeData>) => {
    nodeData.isExpanded = true;
    this.setState(this.state);
  };

  forEachNode(
    nodes: ITreeNode<nodeData>[],
    callback: (node: ITreeNode<nodeData>) => void
  ) {
    if (nodes == null) {
      return;
    }

    for (const node of nodes) {
      callback(node);
      if (node.childNodes) {
        this.forEachNode(node.childNodes, callback);
      }
    }
  }
}

export const Toster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP
});

export default Explorer;
