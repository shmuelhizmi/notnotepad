import React, { Component } from "react";

import { Tabs, Tab, Card } from "@blueprintjs/core";

class Window extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: props.documents,
      selectedTabId: "doc0"
    };
  }
  makePanel = (document, id) => {
    return (
      <div>
        {document}
        {"= document id-" + id}
      </div>
    );
  };
  handleTabChange = e => {
    this.setState({ selectedTabId: e });
  };

  render() {
    return (
      <Tabs
        onChange={this.handleTabChange}
        selectedTabId={this.state.selectedTabId}
        renderActiveTabPanelOnly
      >
        {this.state.documents.map((document, index) => (
          <Tab
            key={"doc" + index}
            id={"doc" + index}
            title={document}
            panel={
              <div style={{ height: "93%", marginTop: "-1%" }}>
                {this.makePanel(document, "doc" + index)}
              </div>
            }
          ></Tab>
        ))}
      </Tabs>
    );
  }
}

export default Window;
