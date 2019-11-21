//react
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

//defualt styling
import "./index.css";
import WebRouter from "./router";

ReactDOM.render(<WebRouter></WebRouter>, document.getElementById("editor"));

serviceWorker.unregister();
