import React, { Component } from "react";
import StorageManager, { codeDir } from "../../Storage/storageManager";
import {
  Dialog,
  InputGroup,
  Card,
  Elevation,
  H6,
  Divider
} from "@blueprintjs/core";

interface RenameFileState {
  isOpen: boolean;
  currentLocation: string;
}
interface RenameFileProps {
  isOpen: boolean;
  currentLocation: string;
  onClose: () => void;
  updateLocation: (newLocation: string) => void;
}

class RenameFile extends Component<RenameFileProps, RenameFileState> {
  storage: StorageManager;
  constructor(props: RenameFileProps) {
    super(props);
    this.storage = new StorageManager();
    this.state = {
      isOpen: props.isOpen,
      currentLocation: props.currentLocation
    };
  }
  Rename = () => {
    const location = this.state.currentLocation;
    const exist = this.storage.syncExists(location, codeDir);
    if (exist) {
      this.props.updateLocation(location);
      this.props.onClose();
    }
  };
  onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      this.Rename();
    }
  };
  render() {
    return (
      <Dialog
        isOpen={this.state.isOpen}
        onClose={this.props.onClose}
        icon="text-highlight"
        title="rename file"
      >
        <InputGroup
          onKeyDown={this.onKey}
          autoFocus
          large
          intent="primary"
          defaultValue={this.state.currentLocation}
          placeholder="enter new name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({ currentLocation: e.target.value });
          }}
        ></InputGroup>
        <Divider></Divider>
        <Card elevation={Elevation.ZERO}>
          <H6>click enter to update location or escape to cancel</H6>
        </Card>
      </Dialog>
    );
  }
}

export default RenameFile;
