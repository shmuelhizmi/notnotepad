import React, { Component } from "react";
import StorageManager from "../../Storage/storageManager";
import {
  Dialog,
  InputGroup,
  Card,
  Elevation,
  H6,
  Divider,
  Switch,
  Classes,
  ButtonGroup,
  Button,
  HTMLTable
} from "@blueprintjs/core";

interface NowPanelState {
  isOpen: boolean;
}
interface NowPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
export default class NowPanel extends Component<NowPanelProps, NowPanelState> {
  constructor(props: NowPanelProps) {
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
              <Button>
                <HTMLTable>
                  <thead>
                    <tr>
                      <th>
                        <img
                          width="25"
                          alt="now"
                          height="25"
                          src="./media/oauth/zeit-black-triangle.svg"
                        ></img>
                      </th>
                      <th>
                        <p>conect to now</p>
                      </th>
                    </tr>
                  </thead>
                </HTMLTable>
              </Button>
              <Button text="publish"></Button>
            </ButtonGroup>
          </div>
        </Dialog>
      </div>
    );
  }
}
