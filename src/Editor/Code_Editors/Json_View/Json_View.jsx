import React from "react";
import CodeEditor from "../../CodeEditor";
import ReactJson from "react-json-view";
import {
  Navbar,
  NavbarGroup,
  NumericInput,
  ControlGroup,
  Alignment,
  Tag
} from "@blueprintjs/core";

export default class JsonView extends CodeEditor {
  constructor(props) {
    super(props);
    this.state = { ...this.state, fontSize: 15 };
  }
  componentDidMount = () => {
    this.setState({ editor: "JsonView" });
  };
  componentWillUnmount = () => {
    this.saveEditorDataFromState();
  };
  updateCode = e => {
    const newCode = JSON.stringify(e.updated_src);
    this.setState({
      code: newCode
    });
    this.updateDocument(newCode);
  };
  makeJSON(code) {
    try {
      return JSON.parse(code);
    } catch {
      return { name: this.state.documentName };
    }
  }
  render() {
    const code = this.makeJSON(this.state.code);
    return (
      <>
        <Navbar>
          <NavbarGroup align={Alignment.CENTER}>
            <ControlGroup fill>
              <Tag className="bp3-inline">Font size</Tag>
              <NumericInput
                value={this.state.fontSize}
                onValueChange={v => {
                  this.setState({
                    fontSize: v
                  });
                }}
                selectAllOnFocus
                allowNumericCharactersOnly
                placeholder="font size"
              ></NumericInput>
            </ControlGroup>
          </NavbarGroup>
        </Navbar>
        <ReactJson
          style={{ fontSize: this.state.fontSize + "px" }}
          theme="ashes"
          name={this.state.documentName}
          src={code}
          onEdit={this.updateCode}
          onAdd={this.updateCode}
          onDelete={this.updateCode}
        ></ReactJson>
      </>
    );
  }
}
