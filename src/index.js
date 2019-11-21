//react
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

//defualt styling
import "./index.css";

import WindowsLayout from "./WindowsLayout";

ReactDOM.render(
  <WindowsLayout></WindowsLayout>,
  document.getElementById("editor")
);

serviceWorker.unregister();
