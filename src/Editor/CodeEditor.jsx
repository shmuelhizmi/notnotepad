import React, { Component } from "react";

import StorageManager from "../Storage/storageManager";
import { file } from "@babel/types";

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.IDkey = props.IDkey;
    this.StorageManager = new StorageManager("Storage Manager");
    this.state = {
      documentName: props.documentName,
      code: "",
      savedData: ""
    };
  }

  componentDidMount = () => {};

  saveEditorData = () => {
    this.StorageManager.safeWriteToFile(this.state.documentName, {
      saveData: this.state.savedData,
      code: this.state.code
    });
  };
  getEditorData = () => {
    if (this.StorageManager.fileExist(this.state.documentName)) {
      console.log(this.StorageManager.getFile(this.state.documentName));
      return this.StorageManager.getFile(this.state.documentName);
    } else {
      this.StorageManager.createFile(this.state.documentName, {
        saveData: this.state.savedData,
        code: this.state.code
      });
      return this.StorageManager.getFile(this.state.documentName);
    }
  };
}

export default CodeEditor;
