import React from "react";
import CodeEditor from "../../CodeEditor";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/theme/material.css";
import "codemirror/lib/codemirror.css";
export default class CodeMirrorEditor extends CodeEditor {
  render() {
    require("codemirror/mode/" +
      this.state.language +
      "/" +
      this.state.language);
    console.log(this.state.language);
    return (
      <div style={{ height: "100%" }}>
        <CodeMirror
          value={this.state.code}
          options={{
            mode: this.state.language,
            theme: "material",
            lineNumbers: true
          }}
          onChange={(editor, data, value) => {
            this.updateDocument(value);
          }}
        ></CodeMirror>
      </div>
    );
  }
}
