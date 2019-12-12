import { Classes, Button, Tooltip } from "@blueprintjs/core";
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
import Terminal from "./LayoutComponents/console/terminal";

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
      second: {
        direction: "column",
        first: 2,
        second: 4,
        splitPercentage: 60
      },
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
  Tabs = () => [
    {
      name: "Editor",
      toolbarControls: React.Children.toArray([
        <Tooltip content="save code">
          <Button minimal icon="code" />
        </Tooltip>,
        <Tooltip content="save">
          <Button minimal icon="saved" />
        </Tooltip>
      ]),
      body: (
        <EditorWindow
          key={Math.random()}
          document={this.state.openDocument}
          editor="Monaco"
        ></EditorWindow>
      )
    },
    {
      name: "Viewport",
      toolbarControls: React.Children.toArray([
        <Button
          onClick={() => {
            window.open(
              "./webView/" + this.state.openDocument,
              "webview",
              "width=550,height=700"
            );
          }}
          minimal
          icon="application"
        >
          open in new window
        </Button>
      ]),
      body: (
        <ViewportWindow
          key={Math.random()}
          document={this.state.openDocument}
        ></ViewportWindow>
      )
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
    },
    {
      name: "Console",
      body: (
        <div>
          <Terminal uid={0} />
        </div>
      )
    }
  ];

  render() {
    return (
      <div style={{ backgroundColor: "rgb(39,44,41,0.5)" }}>
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
