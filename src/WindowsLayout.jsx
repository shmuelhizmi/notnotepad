import { Classes, HTMLSelect } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import classNames from "classnames";
import dropRight from "lodash/dropRight";
import React from "react";

import {
  Corner,
  createBalancedTreeFromLeaves,
  getLeaves,
  getNodeAtPath,
  getOtherDirection,
  getPathToCorner,
  Mosaic,
  MosaicDirection,
  MosaicNode,
  MosaicParent,
  MosaicWindow,
  MosaicZeroState,
  updateTree
} from "react-mosaic-component";

//import { CloseAdditionalControlsButton } from "react-mosaic-component";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./App.css";

import BlocklyEditor from "./Editor/Code_Editors/Blockly_Editor/blockly_Editor";

let windowCount = 3;

export const THEMES = {
  ["Blueprint"]: "mosaic-blueprint-theme",
  ["Blueprint Dark"]: classNames("mosaic-blueprint-theme", Classes.DARK),
  ["None"]: ""
};

const additionalControls = React.Children.toArray([
  //<CloseAdditionalControlsButton />
]);

const EMPTY_ARRAY = [];

export class WindowsLayout extends React.PureComponent {
  state = {
    currentNode: {
      direction: "column",
      first: {
        direction: "row",
        first: 1,
        second: 2,
        splitPercentage: 65
      },
      second: 3,
      splitPercentage: 70
    },
    currentTheme: "Blueprint"
  };

  windows = [
    {
      name: "Editor",
      body: (
        <BlocklyEditor
          IDkey="exmp_key"
          documentName="index.html"
          name="html"
        ></BlocklyEditor>
      )
    },
    {
      name: "code viewer",
      body: (
        <div>
          code
          <h1>Code viewer</h1>
        </div>
      )
    },
    {
      name: "Explorer",
      body: (
        <div>
          code
          <h1>Explorer</h1>
        </div>
      )
    }
  ];

  render() {
    return (
      <React.StrictMode>
        <div>
          <Mosaic
            renderTile={(count, path) => (
              <MosaicWindow
                additionalControls={
                  count === 3 ? additionalControls : EMPTY_ARRAY
                }
                title={this.windows[count - 1].name}
                createNode={this.createNode}
                path={path}
                onDragStart={() => console.log("MosaicWindow.onDragStart")}
                onDragEnd={type => console.log("MosaicWindow.onDragEnd", type)}
              >
                <div>{this.windows[count - 1].body}</div>
              </MosaicWindow>
            )}
            zeroStateView={<MosaicZeroState createNode={this.createNode} />}
            value={this.state.currentNode}
            onChange={this.onChange}
            onRelease={this.onRelease}
            className={THEMES[this.state.currentTheme]}
          />
        </div>
      </React.StrictMode>
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
