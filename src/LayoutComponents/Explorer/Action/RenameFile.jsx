import React, { Component } from "react";
import StorageManager from "../../../Storage/storageManager";
import {
  Dialog,
  InputGroup,
  Card,
  Elevation,
  H6,
  Divider
} from "@blueprintjs/core";

class RenameFile extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager("Storage Manager");
    this.state = {
      isOpen: props.isOpen,
      fileName: this.props.fileName
    };
    this.originalFileName = this.state.fileName;
  }
  Create = e => {
    if (e.keyCode == 13) {
      const fileName = this.state.fileName;
      if (
        fileName != "" &&
        fileName != this.originalFileName &&
        fileName != this.props.folder
      ) {
        this.Storage.renameFile(this.originalFileName, fileName);
        this.props.onClose();
      }
    }
  };
  render() {
    return (
      <Dialog
        isOpen={this.state.isOpen}
        onClose={this.props.onClose}
        icon="add"
        title="create file"
      >
        <InputGroup
          onKeyDown={this.Create}
          autoFocus
          large
          intent="primary"
          defaultValue={this.state.fileName}
          placeholder="enter new name"
          onChange={e => {
            this.setState({ fileName: e.target.value });
            console.log(this.state.fileName);
          }}
        ></InputGroup>
        <Divider></Divider>
        <Card elevation={Elevation.ZERO}>
          <H6>click enter to rename or escape to cancel</H6>
        </Card>
      </Dialog>
    );
  }
}

export default RenameFile;
