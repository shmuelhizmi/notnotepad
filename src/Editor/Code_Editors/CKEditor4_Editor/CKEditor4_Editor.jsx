import React, { Component } from "react";
import CodeEditor from "../../CodeEditor";
import CKEditor from "ckeditor4-react";

export default class CKEditor4Editor extends CodeEditor {
  constructor(props) {
    super(props);
  }
  componentWillMount = () => {
    CKEditor.editorUrl = "http://localhost:3000/code/ckeditor4/ckeditor.js";
  };
  componentDidMount = () => {
    this.setState({ editor: "CKEditor4Editor" });
  };
  onEditorChange = evt => {
    const data = evt.editor.getData();
    this.saveEditorData(data);
  };
  componentWillUnmount = () => {};
  render() {
    const data = this.getEditorData().code;
    return (
      <font color="black">
        <CKEditor data={data} onChange={this.onEditorChange} />
      </font>
    );
  }
}
