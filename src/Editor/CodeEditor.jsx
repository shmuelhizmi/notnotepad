import React, { Component } from "react";
import hotkeys from "hotkeys-js";
import StorageManager from "../Storage/storageManager";

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.IDkey = props.IDkey;
    this.StorageManager = new StorageManager("Storage Manager");
    this.state = {
      language: props.language,
      editor: null,
      documentName: props.documentName,
      code: "",
      saveData: "",
      newDocument: false
    };
  }
  componentWillUnmount = () => {
    this.saveEditorData();
  };
  switchDocument = newDoc => {
    const newEditorData = this.getEditorData(newDoc);
    this.setState({
      newDocument: true,
      documentName: newDoc,
      saveData: newEditorData.saveData,
      code: newEditorData.code
    });
  };
  saveEditorData = () => {
    this.StorageManager.safeWriteToFile(this.state.documentName, {
      editor: this.state.editor,
      saveData: this.state.saveData,
      code: this.state.code
    });
  };
  getEditorData = () => {
    if (this.StorageManager.fileExist(this.state.documentName)) {
      return this.StorageManager.getFile(this.state.documentName);
    } else {
      this.StorageManager.createFile(this.state.documentName, {
        saveData: this.state.saveData,
        code: this.state.code
      });
      return this.StorageManager.getFile(this.state.documentName);
    }
  };
  initializeHotkeys = () => {
    hotkeys("ctrl+s", (event, handler) => {
      event.preventDefault();
      this.StorageManager.downloadFile(
        this.state.documentName,
        this.state.documentName + ".visualss"
      );
    });
    hotkeys("ctrl+shift+s", (event, handler) => {
      event.preventDefault();
      this.StorageManager.downloadFile(
        this.state.documentName,
        this.state.documentName,
        "code"
      );
    });
  };
}

export default CodeEditor;
