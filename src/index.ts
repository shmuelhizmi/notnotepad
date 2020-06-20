import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import "./app.scss";
import WebRouter from "./router";
import BrowserFSStorage from "./Storage/filesystems/browserFS";
import WellcomePage from "./wellcomePage";
import { FocusStyleManager } from "@blueprintjs/core";
import { FileSystem } from "browserfs/dist/node/core/file_system";
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
    fs: FileSystem;
  }
}
ReactDOM.render(
  React.createElement(WellcomePage),
  document.getElementById("editor")
);
BrowserFSStorage().then(async (fs) => {
  FocusStyleManager.onlyShowFocusOnTabs();
  ReactDOM.render(
    React.createElement(WebRouter),
    document.getElementById("editor")
  );

  serviceWorker.unregister();
});
