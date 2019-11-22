import React from "react";
import Viewport from "./viewport";
import Window from "../window";
class ViewportWindow extends Window {
  makePanel = document => {
    return <Viewport document={document}></Viewport>;
  };
}

export default ViewportWindow;
