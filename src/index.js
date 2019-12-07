//react
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import WebRouter from "./router";
import fs from "./Storage/fakeFS";

//testing area

import GIT_API from "./APIS/git/git";
//-------------

//defualt styling
const gitapi = new GIT_API(null);
gitapi.clone("/test/aa/", "https://github.com/isomorphic-git/isomorphic-git");

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
