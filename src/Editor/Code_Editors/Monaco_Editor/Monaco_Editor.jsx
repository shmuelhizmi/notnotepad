import React, { useRef } from "react";

import CodeEditor from "../../CodeEditor";
import Editor from "@monaco-editor/react";

export default class MonacoEditor extends CodeEditor {
  constructor(props) {
    super(props);
    this.getCodeEditorData = null;
    this.autoSaveLoop();
    this.initCode = this.getEditorData().code;
  }
  autoSaveLoop = async () => {
    if (this.getCodeEditorData) {
      this.setState({ code: this.getCodeEditorData() }, () => {
        this.saveEditorData();
      });
    }
    setTimeout(() => {
      this.autoSaveLoop();
    }, 2000);
  };
  componentWillUnmount = () => {
    if (this.getCodeEditorData) {
      this.setState({ code: this.getCodeEditorData() }, () => {
        this.saveEditorData();
      });
    }
  };
  componentDidMount = () => {
    this.setState({ editor: "Monaco" });
  };
  handleEditorDidMount = (_, editor) => {
    this.getCodeEditorData = _;
  };
  handleValueChange = (e, value) => {
    console.log(value);
  };
  render() {
    const code = this.initCode;
    return (
      <>
        <Editor
          theme={"dark"}
          language={this.state.language}
          value={code}
          editorDidMount={this.handleEditorDidMount}
          onChange={this.handleValueChange}
        ></Editor>
      </>
    );
  }
}
