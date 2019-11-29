import React from "react";
import EditorLauncher from "./EditorLauncher";
import Window from "../window";
import { getDocumentLanguage } from "../../Storage/fileutils";
class EditorWindow extends Window {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      editor: props.editor
    };
  }
  makePanel = document => {
    console.log(document);
    return (
      <div>
        <EditorLauncher
          document={document}
          editor={this.props.editor}
        ></EditorLauncher>
      </div>
    );
  };
}

export default EditorWindow;
