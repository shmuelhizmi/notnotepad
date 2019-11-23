import { Classes } from "@blueprintjs/core";
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
import EditorWindow from "./LayoutComponents/Editor/EditorsWindow";

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
    currentTheme: "Blueprint Dark"
  };

  windows = () => {
    return [
      {
        name: "Editor",
        body: (
          <EditorWindow
            documents={["page.html", "index.html"]}
            editor="Blockly"
          ></EditorWindow>
        )
      },
      {
        name: "code viewer",
        body: (
          <ViewportWindow
            documents={["page.html", "index.html"]}
          ></ViewportWindow>
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
  };
  render() {
    return (
      <div>
        <React.StrictMode>
          <Mosaic
            renderTile={(count, path) => (
              <MosaicWindow
                additionalControls={
                  count === 3 ? additionalControls : EMPTY_ARRAY
                }
                title={this.windows()[count - 1].name}
                createNode={this.createNode}
                path={path}
                onDragStart={() => console.log("MosaicWindow.onDragStart")}
                onDragEnd={type => console.log("MosaicWindow.onDragEnd", type)}
              >
                <div>{this.windows()[count - 1].body}</div>
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
