import React from "react";
import Blockly from "blockly";

import registerBlocks from "./blockly/html_blocks";
import HtmlGenerator from "./blockly/html_gen";
import ConfigFiles from "./blockly/toolbox";

import ReactBlocklyComponent from "react-blockly";
import parseWorkspaceXml from "react-blockly/src/BlocklyHelper";

class HtmlEditor extends React.Component {
  constructor(props) {
    registerBlocks();
    super(props);
    this.state = {
      toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML),
      Code: "html",
      SaveData: "",
      IsBlockly: true
    };
  }
  workspaceDidChange = workspace => {
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    const code = HtmlGenerator.workspaceToCode(workspace);
    this.setState({ SaveData: newXml });
    this.setState({ Code: code });
  };

  render = () => {
    return (
      <ReactBlocklyComponent.BlocklyEditor
        toolboxCategories={this.state.toolboxCategories}
        workspaceConfiguration={{
          grid: {
            spacing: 20,
            length: 3,
            colour: "#ccc",
            snap: true
          }
        }}
        initialXml={ConfigFiles.INITIAL_XML}
        wrapperDivClassName="fill-height"
        workspaceDidChange={this.workspaceDidChange}
      />
    );
  };
}
export default HtmlEditor;
