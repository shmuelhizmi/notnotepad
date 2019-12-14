import React, { Component } from "react";

import { Tab, Tabs } from "@blueprintjs/core";
import { Pre, LineNo } from "./styles";

import Highlight, { defaultProps } from "prism-react-renderer";
import { DarkTheme } from "./theme";

import StorageManager, { codeDir } from "../../Storage/storageManager";
import { getDocumentLanguage } from "../../Storage/fileutils";

interface ViewportProps {
  document: string | null;
}

interface ViewportState {
  document: string | null;
  selectedTabId: string;
  index: number;
  code: string;
}

class Viewport extends Component<ViewportProps, ViewportState> {
  Storage: StorageManager;
  constructor(props: ViewportProps) {
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
    setInterval(() => this.codeTick(), 1500);
  }
  getPrismLangusage = () => {
    const lang: any = getDocumentLanguage(this.state.document);
    return lang;
  };
  codeTick() {
    if (this.state.document) {
      this.Storage.getFile(this.state.document, codeDir)
        .then(data => {
          this.setState({
            code: data
          });
        })
        .catch(e => console.log(e));
    }
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
                language={this.getPrismLangusage()}
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
  handleTabChange = (tab: string) => {
    this.setState({ selectedTabId: tab });
  };
}

export default Viewport;
