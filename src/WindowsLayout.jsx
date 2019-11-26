import { Classes, Button, Tooltip, ButtonGroup } from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";

import {
  createBalancedTreeFromLeaves,
  getLeaves,
  Mosaic,
  MosaicWindow,
  MosaicZeroState
} from "react-mosaic-component";

//import { CloseAdditionalControlsButton } from "react-mosaic-component";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./App.css";

import ViewportWindow from "./LayoutComponents/Viewport/ViewportsWindow";
import Explorer from "./LayoutComponents/Explorer/Explorer";
import EditorWindow from "./LayoutComponents/Editor/EditorsWindow";

export const THEMES = {
  ["Blueprint"]: "mosaic-blueprint-theme",
  ["Blueprint Dark"]: classNames("mosaic-blueprint-theme", Classes.DARK),
  ["None"]: ""
};

export class WindowsLayout extends React.PureComponent {
  state = {
    currentNode: {
      direction: "row",
      first: {
        direction: "row",
        first: 3,
        second: 1,
        splitPercentage: 20
      },
      second: 2,
      splitPercentage: 70
    },
    currentTheme: "Blueprint Dark",
    openDocuments: []
  };
  openFile = name => {
    let openDocuments = this.state.openDocuments;
    if (!openDocuments.includes(name)) {
      openDocuments.push(name);
    }
    this.setState({ openDocuments: openDocuments });
    console.log(this.state.openDocuments);
    this.forceUpdate();
  };
  closeFile = name => {};
  Tabs = openDocument => {
    return [
      {
        name: "Editor",
        toolbarControls: React.Children.toArray([
          ,
          <Tooltip content="save code">
            <Button minimal icon="code" />
          </Tooltip>,
          <Tooltip content="save">
            <Button minimal icon="saved" />
          </Tooltip>
        ]),
        body: (
          <EditorWindow
            documents={openDocument}
            editor="Blockly"
          ></EditorWindow>
        )
      },
      {
        name: "Viewport",
        toolbarControls: React.Children.toArray([
          <Button minimal icon="application">
            open in new window
          </Button>
        ]),
        body: <ViewportWindow documents={openDocument}></ViewportWindow>
      },
      {
        name: "Explorer",
        toolbarControls: React.Children.toArray([
          <Tooltip content="create file">
            <Button small minimal icon="add" />
          </Tooltip>,
          <Tooltip content="save project">
            <Button small minimal icon="download" />
          </Tooltip>,
          <Tooltip content="open project">
            <Button small minimal icon="folder-open" />
          </Tooltip>,
          <Tooltip content="compile and download project">
            <Button small minimal intent="success" icon="build" />
          </Tooltip>
        ]),
        body: <Explorer openFile={this.openFile}></Explorer>
      }
    ];
  };
  render() {
    return (
      <div>
        <React.StrictMode>
          <Mosaic
            renderTile={(count, path) => (
              <MosaicWindow
                additionalControls={[]}
                title={this.Tabs()[count - 1].name}
                createNode={this.createNode}
                toolbarControls={
                  this.Tabs(this.state.openDocuments)[count - 1].toolbarControls
                }
                path={path}
                onDragStart={() => console.log("MosaicWindow.onDragStart")}
                onDragEnd={type => console.log("MosaicWindow.onDragEnd", type)}
              >
                <div>{this.Tabs(this.state.openDocuments)[count - 1].body}</div>
              </MosaicWindow>
            )}
            zeroStateView={<MosaicZeroState createNode={this.createNode} />}
            value={this.state.currentNode}
            onChange={this.onChange}
            onRelease={this.onRelease}
            className={THEMES[this.state.currentTheme]}
          />
        </React.StrictMode>
      </div>
    );
  }

  onChange = currentNode => {
    this.setState({ currentNode });
  };

  onRelease = currentNode => {
    console.log("Mosaic.onRelease():", currentNode);
  };

  autoArrange = () => {
    const leaves = getLeaves(this.state.currentNode);

    this.setState({
      currentNode: createBalancedTreeFromLeaves(leaves)
    });
  };
}
export default WindowsLayout;
