import React, { Component } from "react";

import { Tabs, Tab } from "@blueprintjs/core";

class Window extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: props.documents
    };
  }
  makePanel = document => {
    return <div>{document}</div>;
  };
  render() {
    let tabs = [];
    return (
      <Tabs selectedTabId="doc0">
        {this.state.documents.map((document, index) => (
          <Tab
            id={"doc" + index}
            title={document}
            panel={this.makePanel(document)}
          ></Tab>
        ))}
      </Tabs>
    );
  }
}

export default Window;
