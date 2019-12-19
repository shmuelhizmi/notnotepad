import { Component } from "react";
import StorageManager from "../Storage/storageManager";

interface CodeEditorProps {
  language: string;
  documentName: string;
}
interface CodeEditorState {
  language: string;
  documentName: string;
  code: string;
  editor: string;
  editorData: string;
}

class CodeEditor extends Component<CodeEditorProps, CodeEditorState> {
  storage: StorageManager;
  constructor(props: CodeEditorProps) {
    super(props);
    this.storage = new StorageManager();
    const editorData = this.storage.syncGetDocument(props.documentName);
    this.state = {
      language: props.language,
      editor: editorData.editorData.editor,
      documentName: props.documentName,
      code: editorData.code,
      editorData: editorData.editorData.editorData
    };
  }

  saveEditorDataFromState() {
    this.storage.updateFile(this.state.documentName, this.state.code, {
      editor: this.state.editor,
      editorData: this.state.editorData
    });
  }
  updateDocument = (
    code?: string,
    editorData?: { editorData: string; editor: string }
  ) => {
    this.storage.updateFile(this.state.documentName, code, editorData);
  };
  saveEditorData(code: string, editorData: string) {
    let editorDataObject;
    if (editorData) {
      editorDataObject = { editor: this.state.editor, editorData: editorData };
    }
    this.storage.updateFile(this.state.documentName, code, editorDataObject);
  }
}

export default CodeEditor;
