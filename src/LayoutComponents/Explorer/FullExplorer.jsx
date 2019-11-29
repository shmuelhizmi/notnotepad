import React, { Component } from "react";
import { Classes, Tree, Drawer, Button, ButtonGroup } from "@blueprintjs/core";
import Explorer from "./Explorer";
import CreateFile from "./Action/CreateFile";
import DeleteFile from "./Action/DeleteFile";
import RenameFile from "./Action/RenameFile";

class FullExplorer extends Explorer {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isOpen: props.isOpen,
      createFileDialogIsOpen: false,
      deleteFileDialogIsOpen: false,
      renameFileDialogIsOpen: false
    };
  }

  close = e => {
    this.setState({ isOpen: false });
  };
  open = e => {
    this.setState({ isOpen: true });
  };
  openCreateFileDialog = () => {
    this.setState({ createFileDialogIsOpen: true }, () => {
      console.log(this.state.createFileDialogIsOpen);
    });
  };
  closeCreateFileDialog = () => {
    this.setState({ createFileDialogIsOpen: false });
  };
  OpenRenameFileDialog = () => {
    this.setState({ renameDialogIsOpen: true }, () => {
      console.log(this.state.renameDialogIsOpen);
    });
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

  render() {
    console.log("rerender");
    return (
      <div>
        <Button
          minimal
          style={{ width: "100%" }}
          icon="menu-open"
          title="open full explorer"
          onClick={this.open}
        >
          launch full explorer
        </Button>
        <Drawer
          onClose={this.close}
          isOpen={this.state.isOpen}
          title="Full explorer"
          icon="box"
        >
          <ButtonGroup fill>
            <Button icon="add" onClick={this.openCreateFileDialog}>
              Create file
            </Button>
            <Button onClick={this.OpenRenameFileDialog} icon="text-highlight">
              Rename file
            </Button>
            <Button onClick={this.openDeleteFileDialog} icon="remove">
              Delete file
            </Button>
          </ButtonGroup>
          <Tree
            contents={this.state.nodes}
            onNodeClick={this.handleNodeClick}
            onNodeDoubleClick={this.handleNodeDoubleClick}
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand}
            className={Classes.ELEVATION_0}
          ></Tree>
          <ButtonGroup fill minimal>
            <Button icon="download">download file code</Button>
            <Button icon="download">download file data</Button>
            <Button icon="download">download project data</Button>
          </ButtonGroup>
          <Button fill large icon="build">
            compile and dowload project
          </Button>
        </Drawer>
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
      </div>
    );
  }
}

export default FullExplorer;
