import React, { Component } from "react";
import StorageManager, {
  codeDir,
  editorDataDir,
  editorDataDefualtValue
} from "../Storage/storageManager_new";

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.IDkey = props.IDkey;
    this.StorageManager = new StorageManager();
    this.state = {
      language: props.language,
      editor: null,
      documentName: props.documentName,
      code: "",
      editorData: ""
    };
    this.setEditorDataDirct();
  }
  componentDidMount() {}
  componentWillUnmount = () => {
    this.saveEditorData();
  };

  saveEditorData = (
    code = this.state.code,
    editorData = this.state.editorData,
    editor = this.state.editor
  ) => {
    this.StorageManager.updateFile(this.state.documentName, code, {
      editor: editor,
      editorData: editorData
    });
  };
  saveEditorData = code => {
    this.StorageManager.updateFile(this.state.documentName, code);
  };

  setEditorDataDirct = () => {
    const documentData = this.StorageManager.syncGetFile(
      this.state.documentName,
      editorDataDir,
      editorDataDefualtValue
    );
    const documentCode = this.StorageManager.syncGetFile(
      this.state.documentName,
      codeDir
    );
    console.log(documentCode);
    const editorData = JSON.parse(documentData);
    this.state.editorData = editorData.editorData;
    this.state.editor = editorData.editor;
    this.state.code = documentCode;
  };
  saveEditorData() {
    this.StorageManager.updateFile(this.state.documentName, this.state.code, {
      editor: this.state.editor,
      editorData: this.state.editorData
    });
  }
  saveEditorData(code, editorData) {
    let editorDataObject;
    if (editorData) {
      editorDataObject = { editor: this.state.editor, editorData: editorData };
    }
    this.StorageManager.updateFile(
      this.state.documentName,
      code,
      editorDataObject
    );
  }
}

export default CodeEditor;
