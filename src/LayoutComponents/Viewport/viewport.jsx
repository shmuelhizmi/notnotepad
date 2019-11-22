import React, { Component } from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import Highlight, { defaultProps } from "prism-react-renderer";

import StorageManager from "../../Storage/storageManager";
import { getDocumentLanguage } from "../fileutils";

class Viewport extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager("Storage Manager");
    this.state = {
      document: props.document,
      selectedTabId: "wb",
      index: 0
    };
    this.code = this.Storage.getFile(this.state.document).code;
    this.update();
  }
  update = async () => {
    const newCode = this.Storage.getFile(this.state.document).code;
    if (this.code != newCode) {
      this.code = newCode;
      this.forceUpdate();
      this.setState({
        index: Math.random(100)
      });
    }
    setTimeout(() => {
      this.update();
    }, 200);
  };
  render() {
    return (
      <Tabs
        className="Fill"
        id="ViewportTabs"
        onChange={this.handleTabChange}
        selectedTabId={this.state.selectedTabId}
      >
        <Tab
          id="wb"
          title="web view"
          panel={
            <div>
              <iframe
                className="Fill"
                key={this.state.index}
                title="web view"
                src={"./webView/" + this.state.document}
              ></iframe>
            </div>
          }
        />
        <Tab
          id="cd"
          title="code view"
          panel={
            <div>
              <Highlight
                {...defaultProps}
                code={this.code}
                language={getDocumentLanguage(this.state.document)}
              >
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps
                }) => (
                  <pre className={className} style={style}>
                    {tokens.map((line, i) => (
                      <div {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                          <span {...getTokenProps({ token, key })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          }
        />
      </Tabs>
    );
  }
  handleTabChange = e => {
    this.setState({ selectedTabId: e });
  };
}

export default Viewport;
