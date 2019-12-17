import React, { Component } from "react";
import StorageManager from "../../Storage/storageManager";
import {
  Dialog,
  InputGroup,
  Divider,
  Classes,
  ButtonGroup,
  Button,
  HTMLTable
} from "@blueprintjs/core";

interface FtpPanelState {
  isOpen: boolean;
}
interface FtpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
export default class FtpPanel extends Component<FtpPanelProps, FtpPanelState> {
  constructor(props: FtpPanelProps) {
    super(props);
    this.state = {
      isOpen: props.isOpen
    };
  }
  render() {
    console.log(this.state.isOpen);
    return (
      <div>
        <Dialog
          autoFocus
          isOpen={this.state.isOpen}
          onClose={this.props.onClose}
          title="HOST on now"
        >
          <div className={Classes.DIALOG_BODY}>
            <InputGroup fill value="project name"></InputGroup>
            <Divider></Divider>
            <ButtonGroup fill>
              <Button></Button>
              <Button text="publish"></Button>
            </ButtonGroup>
          </div>
        </Dialog>
      </div>
    );
  }
}
