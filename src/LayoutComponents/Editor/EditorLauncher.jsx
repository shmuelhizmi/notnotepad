import React, { Component } from "react";
import { getDocumentLanguage } from "../fileutils";
import BlocklyEditor from "../../Editor/Code_Editors/Blockly_Editor/blockly_Editor";
class EditorLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      document: props.document,
      Editor: props.editor
    };
  }
  render() {
    switch (this.state.Editor) {
      case "Blockly": {
        return React.createElement(BlocklyEditor, {
          documentName: this.state.document,
          name: getDocumentLanguage(this.state.document)
        });
      }
      default: {
        return React.createElement(BlocklyEditor, {
          documentName: this.state.document,
          name: getDocumentLanguage(this.state.document)
        });
      }
    }
  }
}

export default EditorLauncher;
