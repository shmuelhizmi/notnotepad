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
import storageManager, { codeDir } from "./Storage/storageManager";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import Explorer from "./LayoutComponents/Explorer/Explorer";
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
  toolbarControls: JSX.Element;
  body: JSX.Element;
  draggable?: boolean;
}
interface Props {
  theme: Theme;
}

export class WindowsLayout extends React.Component<Props, WindowsLayoutState> {
  constructor(props: Props) {
    super(props);
    storageManager.on("deleteFile", (data) => {
      if (data.storage === codeDir) {
        this.closeTab(data.document);
      }
    });
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
        state.editorTabs.unshift({ filename: name, id: name });
      }
    });
    this.setState({ openDocument: name }, () => {
      this.forceUpdate();
    });
  };

  closeTab = (document: string) => {
    this.setState((state) => {
      const newState = {
        ...state,
        editorTabs: state.editorTabs.filter((tab) => tab.id !== document),
      };
      if (document === state.openDocument) {
        if (state.editorTabs.length === 0) {
          return { ...newState, openDocument: "" };
        } else {
          return { ...newState, openDocument: state.editorTabs[0].filename };
        }
      }
      return newState;
    });
  };

  Tabs: () => tab[] = () => [
    {
      name: "Editor",
      draggable: false,
      toolbarControls: (
        <ProjectNavbar
          document={this.state.openDocument}
          openFile={this.openFile}
          key={this.state.openDocument}
          theme={THEMES[this.state.currentTheme]}
        ></ProjectNavbar>
      ),
      body: this.state.openDocument !== "" && (
        <FilesTabs
          currentTabId={this.state.openDocument}
          tabs={this.state.editorTabs}
          onCloseTab={this.closeTab}
          setActiveTab={(id) => this.openFile(id)}
        />
      ),
    },
    {
      name: "Viewport",
      toolbarControls: (
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
      ),
      body: <Viewport document={this.state.openDocument}></Viewport>,
    },
    {
      name: "Explorer",
      toolbarControls: (
        <FullExplorer
          document={this.state.openDocument}
          openFile={this.openFile}
        ></FullExplorer>
      ),
      body: (
        <div>
          <Explorer
            document={this.state.openDocument}
            openFile={this.openFile}
          ></Explorer>
        </div>
      ),
    },
    {
      name: "Apps",
      toolbarControls: <></>,
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
