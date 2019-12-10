import React, { useRef } from "react";

import CodeEditor from "../../CodeEditor";
import { ControlledEditor } from "@monaco-editor/react";

export default class MonacoEditor extends CodeEditor {
  constructor(props) {
    super(props);
    this.editor = null;
  }

  componentDidMount = () => {
    this.setState({ editor: "Monaco" });
  };
  onEditorMount = (getEditorValue, editor) => {
    this.editor = editor;
    console.log(editor);
  };
  onChange = (event, newCode) => {
    console.log(event);
    this.saveEditorData(newCode);
  };
  render() {
    const code = this.state.code;
    return (
      <>
        <ControlledEditor
          theme={"dark"}
          language={this.state.language}
          value={code}
          onChange={this.onChange}
          editorDidMount={this.onEditorMount}
          options={{
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            automaticLayout: true
          }}
        ></ControlledEditor>
      </>
    );
  }
}
