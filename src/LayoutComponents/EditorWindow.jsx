import React, { Component } from "react";

class EditorWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDocument: props.document
    };
  }
  setDocument = newDocument => {
    this.setState({ openDocument: newDocument });
  };
  render() {
    return <div>base editor window</div>;
  }
}

export default EditorWindow;
