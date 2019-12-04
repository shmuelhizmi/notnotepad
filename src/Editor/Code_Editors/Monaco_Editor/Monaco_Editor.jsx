import React, { useRef } from "react";

import CodeEditor from "../../CodeEditor";
import Editor from "@monaco-editor/react";

export default class MonacoEditor extends CodeEditor {
  constructor(props) {
    super(props);
    this.getCodeEditorData = null;
  }
  autoSaveLoop = async () => {
    if (this.getCodeEditorData) {
      const editorData = this.getCodeEditorData();
      this.setState({ code: editorData }, () => {
        this.saveEditorData();
      });
    }
    setTimeout(() => {
      this.autoSaveLoop();
    }, 2000);
  };
  componentDidMount = () => {
    this.setState({ editor: "Monaco" });
    this.autoSaveLoop();
  };
  handleEditorDidMount = (_, editor) => {
    this.getCodeEditorData = _;
  };

  render() {
    const code = this.state.code;
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
