import React, { Component } from "react";
import { Alert } from "@blueprintjs/core";
import StorageManager from "../../../Storage/storageManager";

class DeleteFile extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager();
    this.state = {
      isOpen: props.isOpen,
      file: props.file
    };
  }
  DELETE = () => {
    this.Storage.removeDocument(this.state.file).then(() => {
      this.props.onClose();
    });
  };
  render() {
    return (
      <Alert
        canEscapeKeyCancel={true}
        canOutsideClickCancel={true}
        isOpen={this.state.isOpen}
        confirmButtonText="DELETE"
        intent="danger"
        cancelButtonText="cancel"
        onCancel={this.props.onClose}
        onConfirm={this.DELETE}
      >
        <p>Are you sure you want to delete file? this action is permanent</p>
      </Alert>
    );
  }
}

export default DeleteFile;
