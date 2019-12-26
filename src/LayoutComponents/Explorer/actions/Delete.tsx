import React, { Component } from "react";
import { Alert } from "@blueprintjs/core";
import StorageManager from "../../../Storage/storageManager";

interface RenameFileState {
  isOpen: boolean;
  selected: string;
  selectedIsDirectory: boolean;
}
interface RenameFileProps {
  selectedIsDirectory: boolean;
  isOpen: boolean;
  selected: string;
  onClose: (success: boolean) => void;
}

class DeleteFile extends Component<RenameFileProps, RenameFileState> {
  storage: StorageManager;
  constructor(props: RenameFileProps) {
    super(props);
    this.storage = new StorageManager();
    this.state = {
      isOpen: props.isOpen,
      selected: props.selected,
      selectedIsDirectory: props.selectedIsDirectory
    };
  }
  DELETE = () => {
    if (this.state.selectedIsDirectory) {
      this.storage.removeDocumentDirectory(this.state.selected).then(() => {
        this.props.onClose(true);
      });
    } else {
      this.storage.removeDocument(this.state.selected).then(() => {
        this.props.onClose(true);
      });
    }
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
        onCancel={() => this.props.onClose(false)}
        onConfirm={this.DELETE}
      >
        <p>Are you sure you want to delete file? this action is permanent</p>
      </Alert>
    );
  }
}

export default DeleteFile;
