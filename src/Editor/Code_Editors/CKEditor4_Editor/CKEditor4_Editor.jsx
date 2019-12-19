import React from "react";
import CodeEditor from "../../CodeEditor";
import CKEditor from "ckeditor4-react";

export default class CKEditor4Editor extends CodeEditor {
  componentWillMount = () => {
    CKEditor.editorUrl = "http://localhost:3000/code/ckeditor4/ckeditor.js";
  };
  componentDidMount = () => {
    this.setState({ editor: "CKEditor4Editor" });
  };
  onEditorChange = evt => {
    const data = evt.editor.getData();
    this.updateDocument(data);
  };
  componentWillUnmount = () => {};
  render() {
    const code = this.state.code;
    return (
      <font color="black">
        <CKEditor data={code} onChange={this.onEditorChange} />
      </font>
    );
  }
}
