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
    if (props.document) {
      return this.makePanel(props.document);
    } else return <div></div>;
  };
  render() {
    return (
      <this.createPanel
        document={this.props.document}
        key={Math.random(100)}
      ></this.createPanel>
    );
  }
}

export default Window;
