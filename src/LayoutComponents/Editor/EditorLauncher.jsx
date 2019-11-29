import React, { Component } from "react";
import { getDocumentLanguage } from "../../Storage/fileutils";
import BlocklyEditor from "../../Editor/Code_Editors/Blockly_Editor/blockly_Editor";
import Monaco_Editor from "../../Editor/Code_Editors/Monaco_Editor/Monaco_Editor";
class EditorLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      document: props.document,
      editor: props.editor
    };
    this.EditorConfig = require("../../config/EditorsConfig.json").Editors[
      this.state.editor
    ];
  }
  getEditorLanguage = () => {
    return this.EditorConfig.Languages[
      getDocumentLanguage(this.state.document)
    ][0];
  };
  render() {
    console.log(this.getEditorLanguage());
    switch (this.state.editor) {
      case "Blockly": {
        return (
          <BlocklyEditor
            documentName={this.state.document}
            language={this.getEditorLanguage()}
          ></BlocklyEditor>
        );
      }
      case "Monaco": {
        return (
          <Monaco_Editor
            documentName={this.state.document}
            language={this.getEditorLanguage()}
          ></Monaco_Editor>
        );
      }
      default: {
        return (
          <BlocklyEditor
            documentName={this.state.document}
            language={this.getEditorLanguage()}
          ></BlocklyEditor>
        );
      }
    }
  }
}

export default EditorLauncher;
