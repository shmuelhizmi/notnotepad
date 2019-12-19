import React, { Component } from "react";
import { ButtonGroup, Button, Popover, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import NowPanel from "../hosting/nowPanel";

interface NavbarProps {
  document: string;
  theme: string;
}
interface NavbarState {
  document: string;
  theme: string;
  hostingPanelIsOpen: boolean;
  githubPanelIsOpen: boolean;
}
export type panels = "now" | "github";

export default class ProjectNavbar extends Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);
    this.state = {
      document: props.document,
      theme: props.theme,
      hostingPanelIsOpen: false,
      githubPanelIsOpen: true
    };
  }
  render() {
    return (
      <div className={classNames("mosaic-blueprint-theme", Classes.DARK)}>
        <ButtonGroup fill minimal>
          <Popover
            minimal
            transitionDuration={10}
            hoverOpenDelay={10}
            hoverCloseDelay={10}
            interactionKind="hover"
            content={
              <ButtonGroup vertical minimal style={ButtonGroupStyle}>
                <Button text="create"></Button>
                <Button text="save"></Button>
                <Button text="export"></Button>
              </ButtonGroup>
            }
          >
            <Button text="File"></Button>
          </Popover>
          <Popover
            minimal
            transitionDuration={10}
            hoverOpenDelay={10}
            hoverCloseDelay={10}
            interactionKind="hover"
            content={
              <ButtonGroup vertical minimal style={ButtonGroupStyle}>
                <Button intent="warning" text="switch editor"></Button>
                <Button text="rename"></Button>
                <Button intent="danger" text="delete"></Button>
              </ButtonGroup>
            }
          >
            <Button text="Edit"></Button>
          </Popover>
          <Popover
            minimal
            transitionDuration={10}
            hoverOpenDelay={10}
            hoverCloseDelay={10}
            interactionKind="hover"
            content={
              <ButtonGroup vertical minimal style={ButtonGroupStyle}>
                <Button text="download code"></Button>
                <Button text="download project"></Button>
                <Button
                  text="HOSTING"
                  intent="primary"
                  onClick={() => this.setState({ hostingPanelIsOpen: true })}
                ></Button>
                <Button text="GIT" intent="success"></Button>
              </ButtonGroup>
            }
          >
            <Button intent="success" text="Project"></Button>
          </Popover>
        </ButtonGroup>
        <div></div>
      </div>
    );
  }
}
const ButtonGroupStyle: React.CSSProperties = {
  width: 200
};
