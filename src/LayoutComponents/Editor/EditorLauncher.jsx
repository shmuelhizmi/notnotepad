import React, { Component } from "react";
import StorageManager, {
  codeDir,
  editorDataDir,
  editorDataDefualtValue
} from "../../Storage/storageManager_new";
import { getDocumentLanguage } from "../../Storage/fileutils";
import BlocklyEditor from "../../Editor/Code_Editors/Blockly_Editor/blockly_Editor";
import MonacoEditor from "../../Editor/Code_Editors/Monaco_Editor/Monaco_Editor";
import { Button, Card, ButtonGroup } from "@blueprintjs/core";
import JsonView from "../../Editor/Code_Editors/Json_View/Json_View";
import CKEditorEditor from "../../Editor/Code_Editors/CKEditor_Editor/CKEditor_Editor";
import CKEditor4Editor from "../../Editor/Code_Editors/CKEditor4_Editor/CKEditor4_Editor";
import MDEDitor from "../../Editor/Code_Editors/MDE_EDITOR/MDE_Editor";
class EditorLauncher extends Component {
  constructor(props) {
    super(props);
    this.Editors = require("../../config/EditorsConfig.json").Editors;
    this.StorageManager = new StorageManager();
    this.state = {
      document: props.document,
      editor: null,
      editorFound: false
    };
    this.getEditorName();
  }
  getEditorName() {
    const document = this.state.document;
    const documentData = this.StorageManager.syncGetFile(
      document,
      editorDataDir,
      editorDataDefualtValue
    );
    const editorName = JSON.parse(documentData).editor;
    if (editorName) {
      this.state.editorFound = true;
      this.state.editor = editorName;
    } else {
      this.state.editor = "Monaco";
    }
  }
  setEditorName(newName) {
    const document = this.state.document;
    this.StorageManager.getFile(
      document,
      editorDataDir,
      editorDataDefualtValue
    ).then(editorData => {
      let editorObject = JSON.parse(editorData);
      editorObject.editor = newName;
      this.StorageManager.setFile(
        document,
        JSON.stringify(editorObject),
        editorDataDir
      ).then(() => {
        this.setState({ editor: newName, editorFound: true });
      });
    });
  }
  getEditorConfig = () => {
    let res = null;
    this.Editors.forEach(Editor => {
      if (Editor.name == this.state.editor) {
        res = Editor;
      }
    });
    return res;
  };
  getEditorByName = name => {
    let res;
    this.Editors.forEach(editor => {
      if (editor.name == name) {
        res = editor;
      }
    });
    return res;
  };
  getEditorLanguage = () => {
    const documentLangusage = getDocumentLanguage(this.state.document);
    const languages = this.getEditorConfig().Languages;

    if (languages && documentLangusage) {
      const editorLanguage = languages[documentLangusage];
      if (editorLanguage) {
        console.log(editorLanguage[0]);
        return editorLanguage[0];
      }
    }
    return "";
  };
  getEditorLogoPath = name => {
    return "./media/editors/" + this.getEditorByName(name).logo;
  };

  getSupportedEditors = () => {
    const fileLanguage = getDocumentLanguage(this.state.document);
    let supportedEditors = [];
    this.Editors.forEach(editor => {
      if (editor.Languages.hasOwnProperty(fileLanguage)) {
        supportedEditors.push(editor.name);
      }
    });
    if (supportedEditors.length == 0) {
      supportedEditors.push("Monaco");
    }
    return supportedEditors;
  };

  UISave = () => {};

  render() {
    if (this.state.editorFound) {
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
            <MonacoEditor
              documentName={this.state.document}
              language={this.getEditorLanguage()}
            ></MonacoEditor>
          );
        }
        case "JsonView": {
          return (
            <JsonView
              documentName={this.state.document}
              language={this.getEditorLanguage()}
            ></JsonView>
          );
        }
        case "CKEditorEditor": {
          return (
            <CKEditorEditor
              documentName={this.state.document}
              language={this.getEditorLanguage()}
            ></CKEditorEditor>
          );
        }
        case "CKEditor4Editor": {
          return (
            <CKEditor4Editor
              documentName={this.state.document}
              language={this.getEditorLanguage()}
            ></CKEditor4Editor>
          );
        }
        case "MDEditor": {
          return (
            <MDEDitor
              documentName={this.state.document}
              language={this.getEditorLanguage()}
            ></MDEDitor>
          );
        }
        default: {
          return (
            <MonacoEditor
              documentName={this.state.document}
              language={""}
            ></MonacoEditor>
          );
        }
      }
    } else {
      return (
        <Card>
          <h3>Please select editor</h3>
          <ButtonGroup fill minimal>
            {this.getSupportedEditors().map((name, index) => (
              <SelectEditorButton
                name={name}
                onClick={() => this.setEditorName(name)}
                logoPath={this.getEditorLogoPath(name)}
                key={index}
              ></SelectEditorButton>
            ))}
          </ButtonGroup>
        </Card>
      );
    }
  }
}

const SelectEditorButton = props => {
  const click = e => {
    props.onClick(props.name);
  };
  return (
    <>
      <Button onClick={click}>
        <img width="75" height="75" src={props.logoPath}></img>
      </Button>
    </>
  );
};

export default EditorLauncher;
