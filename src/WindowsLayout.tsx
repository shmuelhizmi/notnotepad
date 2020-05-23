import { Classes, Button } from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";

import {
  createBalancedTreeFromLeaves,
  getLeaves,
  Mosaic,
  MosaicNode,
  MosaicWindow,
  MosaicZeroState,
} from "react-mosaic-component";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import Explorer from "./LayoutComponents/Explorer/Explorer";
import EditorWindow from "./LayoutComponents/Editor/EditorWindow";
import FullExplorer from "./LayoutComponents/Explorer/FullExplorer";
import ProjectNavbar from "./LayoutComponents/navbar/ProjectNavbar";
import AppLauncher from "./LayoutComponents/apps/launcher";
import Viewport from "./LayoutComponents/Viewport/viewport";
import { FilesTabs, EditorTabs } from "./UIComponents/tabs";
import "./mosaic.css";

export const THEMES = {
  light: "mosaic-blueprint-theme",
  nnp: classNames("nnp-dark", Classes.DARK),
  dark: classNames("mosaic-blueprint-theme", Classes.DARK),
  none: "",
};
export type Theme = keyof typeof THEMES;

export interface WindowsLayoutState {
  currentNode: MosaicNode<number> | null;
  currentTheme: Theme;
  openDocument: string;
  editorTabs: EditorTabs[];
}
interface tab {
  name: string;
  toolbarControls: JSX.Element[];
  body: JSX.Element;
  draggable?: boolean;
}
export class WindowsLayout extends React.PureComponent<
  { theme: Theme },
  WindowsLayoutState
> {
  constructor(props: { theme: Theme }) {
    super(props);
  }
  state: WindowsLayoutState = {
    currentNode: {
      direction: "row",
      first: {
        direction: "row",
        first: 3,
        second: 1,
        splitPercentage: 20,
      },
      second: {
        direction: "column",
        first: 2,
        second: 4,
        splitPercentage: 60,
      },
      splitPercentage: 70,
    },
    currentTheme: this.props.theme,
    openDocument: "",
    editorTabs: [],
  };

  openFile = (name: string) => {
    this.setState((state) => {
      if (!state.editorTabs.find((tab) => tab.filename === name)) {
        state.editorTabs.push({ filename: name, id: name });
        if (state.editorTabs.length > 5) {
          state.editorTabs.shift();
        }
      }
    });
    this.setState({ openDocument: name }, () => {
      this.forceUpdate();
    });
  };

  Tabs: () => tab[] = () => [
    {
      name: "Editor",
      draggable: false,
      toolbarControls: React.Children.toArray([
        <ProjectNavbar
          document={this.state.openDocument}
          openFile={this.openFile}
          key={this.state.openDocument}
          theme={THEMES[this.state.currentTheme]}
        ></ProjectNavbar>,
      ]),
      body: this.state.openDocument !== "" && (
        <FilesTabs
          currentTabId={this.state.openDocument}
          tabs={this.state.editorTabs}
          onCloseTab={(id) => {
            this.setState((state) => {
              state.editorTabs.splice(
                state.editorTabs.findIndex((tab) => tab.id === id),
                1
              );
              if (id === this.state.openDocument) {
                if (state.editorTabs.length === 0) {
                  this.setState({ openDocument: "" });
                } else {
                  this.setState({ openDocument: state.editorTabs[0].filename });
                }
              }
            });
          }}
          setActiveTab={(id) => this.openFile(id)}
        />
      ),
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
        </Button>,
      ]),
      body: <Viewport document={this.state.openDocument}></Viewport>,
    },
    {
      name: "Explorer",
      toolbarControls: React.Children.toArray([
        <FullExplorer openFile={this.openFile}></FullExplorer>,
      ]),
      body: (
        <div>
          <Explorer openFile={this.openFile}></Explorer>
        </div>
      ),
    },
    {
      name: "Apps",
      toolbarControls: React.Children.toArray([]),
      body: (
        <div>
          <AppLauncher />
        </div>
      ),
    },
  ];
  render() {
    return (
      <div
        className="windows-layout"
        style={{ backgroundColor: "rgb(39,44,41,0.5)" }}
      >
        <Mosaic<number>
          renderTile={(count, path) => {
            const tab = this.Tabs()[count - 1];
            return (
              <MosaicWindow<number>
                additionalControls={[]}
                title={tab.name}
                createNode={this.createNode}
                toolbarControls={tab.toolbarControls}
                path={path}
                draggable={tab.draggable}
              >
                <div>{tab.body}</div>
              </MosaicWindow>
            );
          }}
          zeroStateView={<MosaicZeroState createNode={this.createNode} />}
          value={this.state.currentNode}
          onChange={this.onChange}
          className={THEMES[this.state.currentTheme]}
        />
      </div>
    );
  }

  createNode = () => {
    return -1;
  };

  onChange = (currentNode: MosaicNode<number> | null) => {
    this.setState({ currentNode });
  };

  autoArrange = () => {
    const leaves = getLeaves(this.state.currentNode);

    this.setState({
      currentNode: createBalancedTreeFromLeaves(leaves),
    });
  };
}
export default WindowsLayout;
