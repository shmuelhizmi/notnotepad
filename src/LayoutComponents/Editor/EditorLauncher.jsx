import React, { Component } from "react";
import StorageManager from "../../Storage/storageManager";
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
    this.StorageManager = new StorageManager("Storage Manager");
    this.state = {
      document: props.document,
      editor: null,
      editorFound: false
    };
    this.getEditorName();
  }
  getEditorName = () => {
    const document = this.state.document;
    const editorName = this.StorageManager.getFile(document).editor;
    if (editorName) {
      this.state.editorFound = true;
      this.state.editor = editorName;
    } else {
      this.state.editor = "Monaco";
    }
  };
  setEditorName = newName => {
    const document = this.state.document;
    const newValue = this.StorageManager.getFile(document);
    newValue.editor = newName;
    this.StorageManager.safeWriteToFile(document, newValue);
    this.setState({ editor: newName, editorFound: true });
  };
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
    console.log(getDocumentLanguage(this.state.document));
    return this.getEditorConfig().Languages[
      getDocumentLanguage(this.state.document)
    ][0];
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
                onClick={this.setEditorName}
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
