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

class CreateFile extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager();
    this.state = {
      isOpen: props.isOpen,
      fileName: this.props.folder ? this.props.folder + "/" : ""
    };
    this.originalFileName = this.state.fileName;
  }
  Create = e => {
    if (e.keyCode === 13) {
      const fileName = this.state.fileName;
      if (
        fileName &&
        fileName !== this.originalFileName &&
        fileName !== this.props.folder
      ) {
        this.Storage.MakeDocument(fileName).then(() => {
          this.props.onClose();
        });
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
          placeholder="enter file name"
          onChange={e => {
            this.setState({ fileName: e.target.value });
          }}
        ></InputGroup>
        <Divider></Divider>
        <Card elevation={Elevation.ZERO}>
          <H6>click enter to create or escape to cancel</H6>
        </Card>
      </Dialog>
    );
  }
}

export default CreateFile;
