//react
import React from "react";

//UI
import { Search, Portal, Button } from "semantic-ui-react";

//blockly editor
import Blockly from "blockly";
import registerBlocks from "./blockly_html/html_blocks";
import HtmlGenerator from "./blockly_html/html_gen";
import ConfigFiles, { SEARCH_TOOLBOX_XML } from "./blockly_html/toolbox";
//blockly rederer=
import ReactBlocklyComponent from "react-blockly";
import parseWorkspaceXml from "react-blockly/src/BlocklyHelper";

//code viewer
import Highlight, { defaultProps } from "prism-react-renderer";
import { Pre, LineNo } from "../code_viewer/style";

class HtmlEditor extends React.Component {
  constructor(props) {
    registerBlocks();
    super(props);
    this.state = {
      toolboxCategories: parseWorkspaceXml(ConfigFiles.INITIAL_TOOLBOX_XML),
      Code: "html",
      SaveData: "",
      searchKey: ""
    };
  }
  workspaceDidChange = workspace => {
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    const code = HtmlGenerator.workspaceToCode(workspace);
    this.setState({ SaveData: newXml });
    this.setState({ Code: code });
  };

  searchBlocksKeyUpdate = event => {
    const value = event.target.value;
    this.setState({ searchKey: value });
    console.log(this.state.searchKey);
    this.searchBlocks();
  };

  searchBlocks = () => {
    this.setState({
      toolboxCategories: parseWorkspaceXml(
        SEARCH_TOOLBOX_XML(this.state.searchKey)
      )
    });
  };

  render = () => {
    return (
      <div>
        <Portal trigger={<Button content="Search" />} openOnTriggerFocus={true}>
          <Search
            style={{
              left: "40%",
              position: "fixed",
              top: "50%",
              zIndex: 1000
            }}
            results={[{ title: "toolbox filter updated" }]}
          ></Search>
        </Portal>

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
