import React, { Component } from "react";
import CodeEditor from "../../CodeEditor";
import CKEditor from "@ckeditor/ckeditor5-react";
import classicEditor from "@ckeditor/ckeditor5-build-classic";

export default class CKEditorEditor extends CodeEditor {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.setState({ editor: "CKEditorEditor" });
  };
  onEditorChange = (e, editor) => {
    const data = editor.getData();
    this.saveEditorData(data);
  };
  componentWillUnmount = () => {};
  render() {
    const data = this.getEditorData().code;
    return (
      <font color="black">
        <CKEditor
          editor={classicEditor}
          data={data}
          onChange={this.onEditorChange}
        />
      </font>
    );
  }
}
