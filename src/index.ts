//react
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import "./app.scss";
import WebRouter from "./router";
import BrowserFSStorage from "./Storage/filesystems/BrowerFS";
import WellcomePage from "./wellcomePage";
import { FSModule } from "browserfs/dist/node/core/FS";
import { FocusStyleManager } from "@blueprintjs/core";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
    fs: FSModule;
  }
}
ReactDOM.render(
  React.createElement(WellcomePage),
  document.getElementById("editor")
);
BrowserFSStorage((e, fs) => {
  if (e) {
    throw e;
  }
  FocusStyleManager.onlyShowFocusOnTabs();

  window.fs = fs;

  //test area

  ////////////////////////////////////////

  ReactDOM.render(
    React.createElement(WebRouter),
    document.getElementById("editor")
  );

  serviceWorker.unregister();
});
