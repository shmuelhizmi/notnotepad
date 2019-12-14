import React from "react";
import Viewport from "./viewport";
import { WindowsProps, WindowsState } from "../window";
class ViewportWindow extends React.Component<WindowsProps, WindowsState> {
  constructor(props: WindowsProps) {
    super(props);
    this.state = { document: props.document };
  }
  render() {
    return <Viewport document={this.state.document}></Viewport>;
  }
}

export default ViewportWindow;
