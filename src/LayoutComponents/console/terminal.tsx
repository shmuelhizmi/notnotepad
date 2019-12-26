import React, { Component } from "react";
import StorageManager, { codeDir } from "../../Storage/storageManager";
import {
  InputGroup,
  Text,
  ButtonGroup,
  Button,
  Tooltip,
  Position
} from "@blueprintjs/core";
import ReactMarkdown from "react-markdown";
import Scrollbars from "react-custom-scrollbars";
//programs
import { cat, rm, touch, ls } from "../../ConsoleApps/storage";
import git from "../../ConsoleApps/git";
/////////////////////////////////////////////////////////////////
const keyCodes = {
  enter: 13,
  arrowRight: 39,
  arrowUp: 38,
  arrowDown: 40
};

interface TerminalState {
  location: string;
  sudo: boolean;
  terminalText: string;
  allowInput: boolean;
  color: string;
}

interface TerminalProps {}

export interface startObject {
  name: string;
  fullArgs: string[];
  location?: string;
  sudo?: boolean;
  strings: string[];
  fullOptions: string[];
  options: string[];
}

export interface consoleControls {
  setAllowInput: (allow: boolean, cb?: () => void) => void;
  changeColor: (color: string, cb?: () => void) => void;
}

export default class Terminal extends Component<TerminalProps, TerminalState> {
  storage: StorageManager;
  inputRef: HTMLInputElement | null;
  history: string[];
  currentCommand: string;
  currentPlaceInHistory: number;
  scrollbar: Scrollbars | null;
  constructor(props: TerminalProps) {
    super(props);
    this.storage = new StorageManager();
    this.inputRef = null;
    this.currentCommand = "";
    this.history = [];
    this.currentPlaceInHistory = 0;
    this.scrollbar = null;
    this.state = {
      location: "",
      sudo: false,
      terminalText: `
## Hi wellcome to the nnp terminal.
try help?
      `,
      allowInput: true,
      color: "#ffffff"
    };
  }
  setInput = (text: string) => {
    if (this.inputRef) {
      this.inputRef.value = text;
    }
  };
  getRef = (ref: HTMLInputElement | null) => {
    this.inputRef = ref;
  };
  autoComplite = (current: string) => {
    this.setInput("soon");
  };
  onChange = (event: any) => {
    this.currentCommand = event.target.value;
  };
  terminaListener = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = event.keyCode;
    switch (keyCode) {
      case keyCodes.enter: {
        this.execute();
        break;
      }
      case keyCodes.arrowUp: {
        if (this.history.length > this.currentPlaceInHistory + 1) {
          this.currentPlaceInHistory++;
          this.setInput(this.history[this.currentPlaceInHistory]);
        }
        break;
      }
      default: {
      }
    }
  };
  execute = () => {
    this.startProgram(makeCmd(this.currentCommand), this.out);
    this.history.unshift(this.currentCommand);
    this.currentPlaceInHistory = 0;
    this.setInput("");
  };
  out = (text: string) => {
    this.setState(
      { terminalText: this.state.terminalText + "\n\n" + text },
      () => {
        if (this.scrollbar) {
          this.scrollbar.scrollToBottom();
        }
      }
    );
  };
  startProgram = (startObject: startObject, out: (output: string) => void) => {
    const consoleControls: consoleControls = {
      setAllowInput: this.setAllowInput,
      changeColor: this.setColor
    };
    let newStartObject = { ...startObject };
    newStartObject.sudo = this.state.sudo;
    newStartObject.location = this.state.location;
    switch (newStartObject.name) {
      case "clear": {
        this.setState({ terminalText: "" });
        break;
      }
      case "help": {
        out(help);
        break;
      }
      case "cd": {
        this.cd(newStartObject, out);
        break;
      }
      case "rm": {
        rm(newStartObject, out);
        break;
      }
      case "touch": {
        touch(newStartObject, out);
        break;
      }
      case "ls": {
        ls(newStartObject, out);
        break;
      }
      case "cat": {
        cat(newStartObject, out);
        break;
      }
      case "git": {
        git(newStartObject, out, consoleControls);
        break;
      }
      default: {
        out("no such command");
        break;
      }
    }
  };
  cd = (startObject: startObject, out: (output: string) => void) => {
    if (startObject.strings.length >= 1) {
      if (
        this.storage.syncFolderExists(
          startObject.location + startObject.strings[0],
          codeDir
        )
      ) {
        this.setState({
          location: startObject.location + startObject.strings[0] + "/"
        });
      }
    }
  };

  handleStart() {}
  render() {
    return (
      <div style={{ backgroundColor: "rgb(39,44,41,0.5)" }}>
        <ButtonGroup fill minimal>
          <Tooltip content="current location of the console">
            <Button
              icon="folder-close"
              text={"location : /" + this.state.location}
            ></Button>
          </Tooltip>
          <Tooltip
            position={Position.BOTTOM}
            content={
              this.state.sudo
                ? "you are currently in root mode. that will give you more permission [warning this is danger]"
                : "you are currently in user mode. that will prevent you from using dangers commands such as deleting folders"
            }
          >
            <Button
              icon={this.state.sudo ? "grid" : "user"}
              text={this.state.sudo ? "disable root" : "enable root"}
              intent={this.state.sudo ? "danger" : "success"}
              onClick={() => this.setState({ sudo: !this.state.sudo })}
            ></Button>
          </Tooltip>
        </ButtonGroup>
        <Scrollbars
          ref={scrollbar => (this.scrollbar = scrollbar)}
          style={{ height: "83%" }}
        >
          <div style={{ color: this.state.color }}>
            <ReactMarkdown
              escapeHtml={false}
              source={this.state.terminalText}
            ></ReactMarkdown>
          </div>
        </Scrollbars>
        <InputGroup
          style={{ borderColor: "#000", fontFamily: "monospace" }}
          inputRef={this.getRef}
          onKeyDown={this.terminaListener}
          onChange={this.onChange}
          defaultValue={this.currentCommand}
          disabled={!this.state.allowInput}
          rightElement={
            <Button
              disabled={!this.state.allowInput}
              onClick={this.execute}
              text="execute"
              icon="fast-forward"
            ></Button>
          }
        ></InputGroup>
      </div>
    );
  }
  //colsole Controls
  setAllowInput = (allow: boolean, cb?: () => void) => {
    this.setState({ allowInput: allow }, cb ? cb : undefined);
  };
  setColor = (color: string, cb?: () => void) => {
    this.setState({ color: color }, cb ? cb : undefined);
  };
}
const makeCmd = (cmd: string): startObject => {
  let command = cmd.split(" ");
  let resualt: string[] = [];
  let strings: string[] = [];
  let options: string[] = [];
  let fullOptions: string[] = [];
  let currentCmd = "";
  let isInString = false;
  command.forEach(value => {
    if (!isInString && value.charAt(0) !== '"' && !value.includes("-")) {
      resualt.push(value);
    } else if (isInString) {
      if (value.charAt(value.length - 1) === '"') {
        isInString = false;
        strings.push(currentCmd + value.slice(0, value.length - 2));
        currentCmd = "";
      } else {
        currentCmd += value + " ";
      }
    } else if (
      value.charAt(0) === '"' &&
      value.charAt(value.length - 1) === '"'
    ) {
      strings.push(value.slice(1, value.length - 1));
    } else if (value.charAt(0) === '"') {
      isInString = true;
      currentCmd += value.slice(1, value.length - 1) + " ";
    } else if (value.includes("-")) {
      if (value.includes("--")) {
        fullOptions.push(value);
      } else {
        options.push(value);
      }
    }
  });

  //make args object
  let program: startObject = {
    name: resualt[0],
    fullArgs: resualt.length > 1 ? resualt.slice(1, resualt.length) : [],
    options: options,
    fullOptions: fullOptions,
    strings: strings
  };

  return program;
};

const help = `
basic 
help - to get some help
cd - to move directory
rm - to remove files
touch - to create file
ls - to list files in the current directory
cat - to print file to the console
git - git client
`;
