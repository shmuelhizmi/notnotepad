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
import FullExplorer from "./LayoutComponents/Explorer/FullExplorer";

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
    openDocument: null
  };
  openFile = name => {
    this.setState({ openDocument: name }, () => {
      this.forceUpdate();
    });
  };
  Tabs = () => {
    const openDocument = this.state.openDocument;
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
          <EditorWindow document={openDocument} editor="Monaco"></EditorWindow>
        )
      },
      {
        name: "Viewport",
        toolbarControls: React.Children.toArray([
          <Button minimal icon="application">
            open in new window
          </Button>
        ]),
        body: <ViewportWindow document={openDocument}></ViewportWindow>
      },
      {
        name: "Explorer",
        toolbarControls: React.Children.toArray([
          <FullExplorer openFile={this.openFile}></FullExplorer>
        ]),
        body: (
          <div>
            <Explorer openFile={this.openFile}></Explorer>
          </div>
        )
      }
    ];
  };
  render() {
    return (
      <div>
        <Mosaic
          renderTile={(count, path) => (
            <MosaicWindow
              additionalControls={[]}
              title={this.Tabs()[count - 1].name}
              createNode={this.createNode}
              toolbarControls={this.Tabs()[count - 1].toolbarControls}
              path={path}
            >
              <div>{this.Tabs()[count - 1].body}</div>
            </MosaicWindow>
          )}
          zeroStateView={<MosaicZeroState createNode={this.createNode} />}
          value={this.state.currentNode}
          onChange={this.onChange}
          onRelease={this.onRelease}
          className={THEMES[this.state.currentTheme]}
        />
      </div>
    );
  }

  onChange = currentNode => {
    this.setState({ currentNode });
  };

  autoArrange = () => {
    const leaves = getLeaves(this.state.currentNode);

    this.setState({
      currentNode: createBalancedTreeFromLeaves(leaves)
    });
  };
}
export default WindowsLayout;
