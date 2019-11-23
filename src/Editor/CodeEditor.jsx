import { Component } from "react";

import StorageManager from "../Storage/storageManager";

class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.IDkey = props.IDkey;
    this.StorageManager = new StorageManager("Storage Manager");
    this.state = {
      documentName: props.documentName,
      code: "",
      saveData: "",
      newDocument: false
    };
  }

  componentDidMount = () => {};
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
}

export default CodeEditor;
