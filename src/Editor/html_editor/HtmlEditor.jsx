//react
import React from "react";

//UI

//blockly editor
import Blockly from "blockly";
import registerBlocks from "./blockly/html_blocks";
import HtmlGenerator from "./blockly/html_gen";
import ConfigFiles from "./blockly/toolbox";
//blockly rederer
import ReactBlocklyComponent from "react-blockly";
import parseWorkspaceXml from "react-blockly/src/BlocklyHelper";

//code viewer
import Highlight, { defaultProps } from "prism-react-renderer";
import { Pre, LineNo } from "../code_viewer/style";

class HtmlEditor extends React.Component {
  constructor(props) {
    registerBlocks();
    super(props);
    console.log(ConfigFiles.INITIAL_TOOLBOX_XML);
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
      <div>
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

        <Highlight {...defaultProps} code={this.state.Code} language="markup">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  <LineNo>{i + 1}</LineNo>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </Pre>
          )}
        </Highlight>
      </div>
    );
  };
}
export default HtmlEditor;
