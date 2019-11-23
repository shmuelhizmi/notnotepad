import React, { Component } from "react";
import { getDocumentLanguage } from "../fileutils";
import BlocklyEditor from "../../Editor/Code_Editors/Blockly_Editor/blockly_Editor";
class EditorLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      document: props.document,
      editor: props.editor
    };
  }
  render() {
    switch (this.state.editor) {
      case "Blockly": {
        return (
          <BlocklyEditor
            documentName={this.state.document}
            name={getDocumentLanguage(this.state.document)}
          ></BlocklyEditor>
        );
      }
      default: {
        return (
          <BlocklyEditor
            documentName={this.state.document}
            name={getDocumentLanguage(this.state.document)}
          ></BlocklyEditor>
        );
      }
    }
  }
}

export default EditorLauncher;
