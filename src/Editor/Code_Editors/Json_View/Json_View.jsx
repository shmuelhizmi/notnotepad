import React from "react";
import CodeEditor from "../../CodeEditor";
import ReactJson from "react-json-view";
export default class JsonView extends CodeEditor {
  constructor(props) {
    super(props);
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
    this.saveEditorData(newCode);
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
      <ReactJson
        theme="ashes"
        name={this.state.documentName}
        src={code}
        onEdit={this.updateCode}
        onAdd={this.updateCode}
        onDelete={this.updateCode}
      ></ReactJson>
    );
  }
}
