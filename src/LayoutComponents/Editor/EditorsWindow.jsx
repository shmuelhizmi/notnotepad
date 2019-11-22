import React from "react";
import EditorLauncher from "./EditorLauncher";
import Window from "../window";
import { getDocumentLanguage } from "../fileutils";
class EditorWindow extends Window {
  makePanel = document => {
    return (
      <EditorLauncher
        document={document}
        editor={getDocumentLanguage(document)}
      ></EditorLauncher>
    );
  };
}

export default EditorWindow;
