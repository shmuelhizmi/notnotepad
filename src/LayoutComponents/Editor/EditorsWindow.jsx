import React from "react";
import EditorLauncher from "./EditorLauncher";
import Window from "../window";
import { getDocumentLanguage } from "../fileutils";
class EditorWindow extends Window {
  constructor(props) {
    super(props);
    this.setState({
      editor: props.editor
    });
  }
  makePanel = (document, id) => {
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
