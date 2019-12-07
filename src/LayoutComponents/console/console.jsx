import React, { Component } from "react";
import Terminal from "terminal-in-react";
import StorageManager from "../../Storage/storageManager";
import moduleName from "fs";

export default class Console extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager("Storage Manager");
  }
  executer = (cmd, out) => {
    switch (cmd[0]) {
      case "cat": {
        if (cmd[1]) {
          const file = this.Storage.getFile(cmd[1]);
          if (file) {
            out(file.code);
          } else {
            out("file not found");
          }
          return;
        } else {
          out("no file specified");
          return;
        }
      }
      case "cmd": {
        let js = cmd;
        js.shift();
        js = js.join(" ");
        let res;
        try {
          res = eval(js);
        } catch (err) {
          res = err.toString();
        }
        out(res);
        return;
      }
      default: {
        out("commend not found");
        return;
      }
    }
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <Terminal
          allowTabs={false}
          descriptions={{
            ls: "listFile"
          }}
          commands={{
            ls: () => console.log(this.Storage.getFilesArray())
          }}
          commandPassThrough={this.executer}
          color="white"
          backgroundColor="transparent"
          barColor="black"
          style={{ fontWeight: "bold", fontSize: "1em" }}
          hideTopBar
          startState={"maximised"}
          msg="NotNotePad-- type help for help"
        />
      </div>
    );
  }
}
