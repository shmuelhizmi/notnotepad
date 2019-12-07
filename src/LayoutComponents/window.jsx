import React, { Component } from "react";

class Window extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDocument: props.document
    };
  }
  makePanel = document => {
    return <div>{document}</div>;
  };
  createPanel = props => {
    if (this.state.openDocument) {
      return this.makePanel(this.state.openDocument);
    } else return <div></div>;
  };
  render() {
    return (
      <this.createPanel
        document={this.state.openDocument}
        key={Math.random(100)}
      ></this.createPanel>
    );
  }
}

export default Window;
