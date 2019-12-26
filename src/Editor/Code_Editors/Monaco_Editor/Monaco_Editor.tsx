import React from "react";
import CodeEditor, { CodeEditorProps, Toster } from "../../CodeEditor";
import Editor, { monaco } from "@monaco-editor/react";
import { Button } from "@blueprintjs/core";
import { editor } from "monaco-editor";

const themeDark: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [{ background: "293742", token: "" }],
  colors: {
    //editor
    "editor.foreground": "#CDE7F8",
    descriptionForeground: "#F29D49",
    "editor.background": "#293742",
    "editor.editorCursor.foreground": "#00998C",
    "editor.lineHighlightBackground": "#4580E60f",
    "editor.selectionBackground": "#634DBF30",
    "selection.background": "#00B3A4",
    "editorWidget.background": "#1F2430",
    "editorWidget.border": "#090702",
    "editorHoverWidget.background": "#1F2430",
    "dropdown.background": "#293742",
    "dropdown.border": "#9179F2",
    //scrollbarSlider
    "scrollbarSlider.background": "#00998C",
    "scrollbarSlider.hoverBackground": "#00998C",
    "scrollbarSlider.activeBackground": "#2965CC55",
    "scrollbar.shadow": "#2965CC55",
    //suggestion
    "editorSuggestWidget.background": "#1F243099",
    "editorSuggestWidget.selectedBackground": "#23525B99",
    "editorSuggestWidget.highlightForeground": "#9179F299"
  }
};

export default class MonacoEditor extends CodeEditor {
  editor: editor.IStandaloneCodeEditor | null;
  isSaved: boolean;
  constructor(props: CodeEditorProps) {
    super(props);
    this.editor = null;
    this.isSaved = true;
    this.editorOptions = { saveHotky: true };
    this.registerOptions(this.editorOptions);
  }
  componentWillMount = () => {
    monaco.init().then(monaco => {
      monaco.editor.defineTheme("nnp", themeDark);
    });
  };
  componentWillUnmount = () => {
    const code = this.editor.getValue();
    const name = this.state.documentName;
    if (!this.isSaved) {
      Toster.show({
        message: (
          <div>
            Do you want to save the changes you made in "{name}"
            <Button
              minimal
              onClick={() => {
                this.updateDocument(code);
                Toster.clear();
              }}
              icon="tick"
              text="yes"
            />
          </div>
        ),
        intent: "warning",
        timeout: 0
      });
    }
  };
  componentDidMount = () => {
    this.setState({ editor: "Monaco" });
  };
  onEditorMount = (
    getEditorValue: () => string,
    editor: editor.IStandaloneCodeEditor
  ) => {
    this.editor = editor;
    this.editor.setValue(this.state.code);
    this.isSaved = true;
    this.editor.addAction({
      id: "NNP_SAVE",
      label: "save file",
      keybindings: [2048 | 49],
      run: this.save,
      contextMenuGroupId: "9_cutcopypaste"
    });
    this.editor.onKeyDown(() => {
      this.onChange();
    });
  };

  save = () => {
    this.updateDocument(this.editor.getValue());
    Toster.show({ message: "saved", intent: "success" });
  };
  onChange = () => {
    this.isSaved = false;
  };
  render() {
    return (
      <div style={{ zIndex: 5 }}>
        <Editor
          theme="nnp"
          options={{
            automaticLayout: true
          }}
          language={this.state.language}
          editorDidMount={this.onEditorMount}
        ></Editor>
      </div>
    );
  }
}
