import { Component } from "react";
import StorageManager from "../Storage/storageManager";
import hotkeys from "hotkeys-js";
import { Toaster, Position } from "@blueprintjs/core";
export interface CodeEditorProps {
  language: string;
  documentName: string;
}
export interface CodeEditorState {
  language: string;
  documentName: string;
  code: string;
  editor: string;
  editorData: string;
}
interface editorOptions {
  saveHotky?: boolean;
}

class CodeEditor extends Component<CodeEditorProps, CodeEditorState> {
  editorOptions?: editorOptions;
  storage: typeof StorageManager;
  constructor(props: CodeEditorProps) {
    super(props);
    this.storage = StorageManager;
    const editorData = this.storage.syncGetDocument(props.documentName);
    this.state = {
      language: props.language,
      editor: editorData.editorData.editor,
      documentName: props.documentName,
      code: editorData.code,
      editorData: editorData.editorData.editorData
    };
  }

  registerOptions = (opt: editorOptions) => {
    if (opt.saveHotky) {
      hotkeys("ctrl+s", event => {
        event.preventDefault();
        this.saveEditorDataFromState();
      });
    }
  };

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

export const Toster = Toaster.create({
  className: "recipe-toaster",
  position: Position.BOTTOM,
  maxToasts: 5
});
