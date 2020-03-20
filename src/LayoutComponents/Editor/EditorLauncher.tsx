import React, { Component } from "react";
import StorageManager, {
  editorDataDir,
  editorDataDefualtValue
} from "../../Storage/storageManager";
import { getDocumentLanguage } from "../../Storage/fileutils";
import Blockly from "../../Editor/Code_Editors/Blockly_Editor/blockly_Editor";
import Monaco from "../../Editor/Code_Editors/Monaco_Editor/Monaco_Editor";
import { Button, Card, ButtonGroup } from "@blueprintjs/core";
import JsonView from "../../Editor/Code_Editors/Json_View/Json_View";
import CKEditorEditor from "../../Editor/Code_Editors/CKEditor_Editor/CKEditor_Editor";
import CKEditor4Editor from "../../Editor/Code_Editors/CKEditor4_Editor/CKEditor4_Editor";
import MDEDitor from "../../Editor/Code_Editors/MDE_Editor/MDE_Editor";
import CodeMirror from "../../Editor/Code_Editors/CodeMirror_Editor/CodeMirror_Editor";
import JsonObjectEditor from "../../Editor/Code_Editors/Json_Object_Editor/JsonObjectEditor";
const Editors = {
  Blockly,
  Monaco,
  JsonView,
  CKEditorEditor,
  CKEditor4Editor,
  MDEDitor,
  CodeMirror,
  JsonObjectEditor
};

interface EditorLauncherState {
  document: string | null;
  editor: string;
  editorFound: boolean;
}
interface EditorLauncherProps {
  document: string | null;
  editor?: string | undefined | null;
}

export interface CodeViewer {
  Languages: string[];
}

export interface Editor {
  name: string;
  logo: string;
  codeViewer: boolean;
  Languages: any;
}

export interface EditorsConfig {
  codeViewer: CodeViewer;
  Editors: Editor[];
}

class EditorLauncher extends Component<
  EditorLauncherProps,
  EditorLauncherState
> {
  Editors: Editor[];
  StorageManager: StorageManager;
  constructor(props: EditorLauncherProps) {
    super(props);
    this.Editors = require("../../config/EditorsConfig.json").Editors;
    this.StorageManager = new StorageManager();
    const editor = this.getEditor(props);
    this.state = {
      document: props.document,
      editor: editor[0],
      editorFound: editor[1]
    };
  }
  getEditor(props: EditorLauncherProps): [string, boolean] {
    const document = props.document;
    if (document) {
      const documentData = this.StorageManager.syncGetFile(
        document,
        editorDataDir,
        editorDataDefualtValue
      );
      const editorName = JSON.parse(documentData).editor;
      if (editorName) {
        return [editorName, true];
      }
    }
    return ["", false];
  }
  getEditorConfig(): Editor | null {
    const editor = this.getEditorByName(this.state.editor);
    if (editor) {
      return editor;
    }
    return null;
  }
  getEditorByName(name: string): Editor | null {
    let res: Editor | null;
    res = null;
    this.Editors.forEach(editor => {
      if (editor.name === name) {
        res = editor;
      }
    });
    return res;
  }
  getEditorLanguage = () => {
    const documentLangusage = getDocumentLanguage(this.state.document);
    const editor = this.getEditorConfig();
    if (editor) {
      const languages = editor.Languages;

      if (languages && documentLangusage) {
        const editorLanguage = languages[documentLangusage];
        if (editorLanguage) {
          return editorLanguage[0];
        }
      }
    }
    return "";
  };
  getEditorLogoPath = (name: string) => {
    const editor = this.getEditorByName(name);
    if (editor) {
      return "./media/editors/" + editor.logo;
    }
    return null;
  };

  getSupportedEditors = () => {
    const fileLanguage = getDocumentLanguage(this.state.document);
    let supportedEditors = [];
    this.Editors.forEach(editor => {
      if (editor.Languages.hasOwnProperty(fileLanguage)) {
        supportedEditors.push(editor.name);
      }
    });
    if (supportedEditors.length === 0) {
      supportedEditors.push("Monaco");
    }
    return supportedEditors;
  };

  setEditorName = (name: string) => {
    if (this.state.document) {
      this.StorageManager.setEditor(this.state.document, name);
      this.setState({ editor: name, editorFound: true });
    }
  };

  render() {
    if (this.state.editorFound && this.state.document) {
      return React.createElement(Editors[this.state.editor], {
        language: this.getEditorLanguage(),
        documentName: this.state.document
      });
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

interface SelectEditorButtonProps {
  name: string;
  onClick: (name: string) => void;
  logoPath: string | null;
}

const SelectEditorButton = (props: SelectEditorButtonProps) => {
  const click = () => {
    props.onClick(props.name);
  };
  return (
    <>
      <Button onClick={click}>
        <img
          width="75"
          alt={props.name}
          height="75"
          src={props.logoPath ? props.logoPath : ""}
        ></img>
      </Button>
    </>
  );
};

export default EditorLauncher;
