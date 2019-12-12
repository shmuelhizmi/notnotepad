import React, { Component } from "react";

import { Tab, Tabs } from "@blueprintjs/core";
import { Pre, LineNo } from "./styles";

import Highlight, { defaultProps } from "prism-react-renderer";
import { DarkTheme } from "./theme";

import StorageManager, { codeDir } from "../../Storage/storageManager";
import { getDocumentLanguage } from "../../Storage/fileutils";

class Viewport extends Component {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager();
    this.state = {
      document: props.document,
      selectedTabId: "wb",
      index: 0,
      code: ""
    };
  }
  componentDidMount() {
    setInterval(() => this.codeTick(), 300);
  }
  codeTick() {
    this.Storage.getFile(this.state.document, codeDir)
      .then(data => {
        this.setState({
          code: data
        });
      })
      .catch(e => console.log(e));
  }
  render() {
    return (
      <Tabs
        id="ViewportTabs"
        onChange={this.handleTabChange}
        selectedTabId={this.state.selectedTabId}
      >
        <Tab
          id="wb"
          title="web view"
          panel={
            <div style={{ height: "93%", marginTop: "-3%" }}>
              <iframe
                title="page view"
                className="Fill"
                key={this.state.index}
                srcDoc={this.state.code}
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
                code={this.state.code}
                theme={DarkTheme}
                language={getDocumentLanguage(this.state.document)}
              >
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps
                }) => (
                  <Pre className={className} style={style}>
                    {tokens.map((line, i) => (
                      <div {...getLineProps({ line, key: i })}>
                        <LineNo>{i + 1}</LineNo>
                        {line.map((token, key) => (
                          <span {...getTokenProps({ token, key })} />
                        ))}
                      </div>
                    ))}
                  </Pre>
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
