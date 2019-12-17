//react
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import WebRouter from "./router";
import BrowserFSStorage from "./Storage/filesystems/BrowerFS";
import WellcomePage from "./wellcomePage";

ReactDOM.render(
  <WellcomePage></WellcomePage>,
  document.getElementById("editor")
);
BrowserFSStorage((e, fs) => {
  if (e) {
    throw e;
  }
  window.fs = fs;

  //test area

  ////////////////////////////////////////
  console.log(
    `
    ╔═╦╦═╦══╗█╔═╦╦═╦══╦═╗╔═╦══╦══╗
    ║║║║║╠╗╔╩═╣║║║║╠╗╔╣╦╝║╬║╔╗╠╗╗║
    ║║║║║║║╠══╣║║║║║║║║╩╗║╔╣╠╣╠╩╝║
    ╚╩═╩═╝╚╝██╚╩═╩═╝╚╝╚═╝╚╝╚╝╚╩══╝
    

    `
  );

  ReactDOM.render(<WebRouter></WebRouter>, document.getElementById("editor"));

  serviceWorker.unregister();
});
