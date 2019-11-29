import React from "react";
import CodeEditor from "../../CodeEditor";
import MonacoEditor from "@monaco-editor/react";

export default class Monaco_Editor extends CodeEditor {
  constructor(props) {
    super(props);
    this.editor = null;
    this.editorModel = null;
  }
  componentDidMount = () => {
    this.setState({ editor: "Monaco" });
    this.autoSave();
  };
  autoSave = () => {
    this.saveToCode();
    this.saveEditorData();
    setTimeout(() => {
      this.autoSave();
    }, 500);
  };
  saveToCode = () => {
    if (this.editorModel) {
      this.setState({
        code: this.editorModel.getValue()
      });
    }
  };
  editorDidMount = (editor, monaco) => {
    this.editor = editor;
    console.log(editor);
    //this.editor = editor.getModel();
  };
  onChange = (newValue, e) => {
    console.log(newValue);
    this.setState({ code: newValue });
    this.saveEditorData();
  };
  render() {
    const code = this.getEditorData().code;
    console.log(code);
    return (
      <div>
        <MonacoEditor
          width="100%"
          language={this.state.language}
          theme="vs-dark"
          value={code}
          editorDidMount={this.editorDidMount}
          onChange={this.onChange}
        ></MonacoEditor>
      </div>
    );
  }
}
