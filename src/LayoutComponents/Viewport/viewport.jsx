import React, { Component } from "react";

import { Tab, Tabs } from "@blueprintjs/core";

import EditorWindow from "../EditorWindow";

import Highlight, { defaultProps } from "prism-react-renderer";

import StorageManager from "../../Storage/storageManager";

class Viewport extends EditorWindow {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager("Storage Manager");
    this.setState({
      selectedTabId: "code"
    });
    this.update();
  }
  getDocumentLanguage = name => {
    return name.slice(name.indexOf(".") + 1, name.lenght);
  };
  update = async () => {
    this.forceUpdate();
    setTimeout(() => {
      this.update();
    }, 500);
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
          id="web"
          title="web view"
          panel={
            <iframe
              className="Fill"
              src={"./webView/" + this.state.openDocument}
            ></iframe>
          }
        />
        <Tab
          id="code"
          title="code view"
          panel={
            <div>
              <Highlight
                {...defaultProps}
                code={this.Storage.getFile(this.state.openDocument).code}
                language={this.getDocumentLanguage(this.state.openDocument)}
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
  handleTabChange = e => {};
}

export default Viewport;
