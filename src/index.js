//react
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import WebRouter from "./router";
import BrowserFSStorage from "./Storage/BrowerFS";
import GIT_API from "./APIS/git/git";
import StorageManager, {
  codeDir,
  editorDataDir
} from "./Storage/storageManager_new";
import * as BrowserFS from "browserfs/dist/node/core/browserfs";
BrowserFSStorage((e, fs) => {
  if (e) {
    throw e;
  }
  window.fs = fs;
  console.log(window.fs);

  //testing area
  const storage = new StorageManager();
  const gitapi = new GIT_API();
  //-------------

  //defualt styling

  console.log(
    `
    ╬╬╬╬╬╬╬╬╬╬╬╬╬┌┐╬╬╬╬╬╬╬╬╬╬╬╬╬┌┐╬╬╬╬╬╬╬╬╬╬╬┌┐╬╬╬╬╬┌┐╬╬╬╬
    ╬╬╬╬╬╬╬╬╬╬╬╬╬││╬╬╬╬╬╬╬╬╬╬╬╬┌┘└┐╬╬╬╬╬╬╬╬╬┌┘└┐╬╬╬╬││╬╬╬╬
    ┌┐┌┬┬──┬┐┌┬──┤│╬┌──┬──┬─┬┬─┴┐┌┼┬─┐┌──┐┌─┴┐┌┼┐┌┬─┘├┬──┐
    │└┘├┤──┤│││┌┐││╬│──┤┌─┤┌┼┤┌┐││├┤┌┐┤┌┐││──┤│││││┌┐├┤┌┐│
    └┐┌┤├──│└┘│┌┐│└┐├──│└─┤│││└┘│└┤││││└┘│├──│└┤└┘│└┘││└┘│
    ╬└┘└┴──┴──┴┘└┴─┘└──┴──┴┘└┤┌─┴─┴┴┘└┴─┐│└──┴─┴──┴──┴┴──┘
    ╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬││╬╬╬╬╬╬╬┌─┘│╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬
    ╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬└┘╬╬╬╬╬╬╬└──┘╬╬╬╬╬╬©shmuelHizmi
  `
  );

  ReactDOM.render(<WebRouter></WebRouter>, document.getElementById("editor"));

  serviceWorker.unregister();
});
