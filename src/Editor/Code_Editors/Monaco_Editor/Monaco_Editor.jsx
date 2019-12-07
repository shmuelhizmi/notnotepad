import React, { useRef } from "react";

import CodeEditor from "../../CodeEditor";
import { ControlledEditor } from "@monaco-editor/react";

export default class MonacoEditor extends CodeEditor {
  constructor(props) {
    super(props);
    this.getCodeEditorData = null;
  }

  componentDidMount = () => {
    this.setState({ editor: "Monaco" });
  };
  onChange = (event, newCode) => {
    this.setState({
      code: newCode
    });
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
