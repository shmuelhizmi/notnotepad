import React, { Component } from "react";
import hotkeys from "hotkeys-js";
import StorageManager from "../Storage/storageManager";
import { ButtonGroup, Button } from "@blueprintjs/core";

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
    this.setEditorDataDirct();
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
  saveEditorData = (
    code = this.state.code,
    saveData = this.state.saveData,
    editor = this.state.editor
  ) => {
    this.StorageManager.safeWriteToFile(this.state.documentName, {
      editor: editor,
      saveData: saveData,
      code: code
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
  setEditorData = () => {
    const editorData = this.getEditorData();
    this.setState({
      saveData: editorData.saveData,
      code: editorData.code
    });
  };
  setEditorDataDirct = () => {
    const editorData = this.getEditorData();
    this.state.saveData = editorData.saveData;
    this.state.code = editorData.code;
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
