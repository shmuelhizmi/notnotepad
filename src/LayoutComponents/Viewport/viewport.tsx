import React, { Component } from "react";

import Tabs from "../../UIComponents/tabs";
import { Pre, LineNo } from "./styles";
import Highlight, { defaultProps } from "prism-react-renderer";
import { DarkTheme } from "./theme";
import Now from "../hosting/nowPanel";
import StorageManager, { codeDir } from "../../Storage/storageManager";
import { getDocumentLanguage } from "../../Storage/fileutils";
import Scrollbars from "react-custom-scrollbars";
import { html as inline } from "web-resource-inliner";
import { dirname, join } from 'path'
interface ViewportProps {
  document: string | null;
}

interface ViewportState {
  index: number;
  code: string;
  html: string;
}

class Viewport extends Component<ViewportProps, ViewportState> {
  Storage: typeof StorageManager;
  constructor(props: ViewportProps) {
    super(props);
    this.Storage = StorageManager;
    this.state = {
      index: 0,
      code: "",
      html: "",
    };
  }
  componentDidMount() {
    setInterval(() => this.codeTick(), 1500);
  }
  getPrismLangusage = () => {
    const lang: any = getDocumentLanguage(this.props.document);
    return lang;
  };
  codeTick() {
    if (this.props.document) {
      if (
        this.props.document.lastIndexOf(".html") ===
        this.props.document.length - ".html".length
      ) {
        this.Storage.getFile(this.props.document, codeDir).then((data) => {
          inline({ fileContent: data, relativeTo: dirname(join(codeDir, this.props.document)) }, (e, r) => {
            this.setState({
              code: data,
              html: r,
            });
          });
        });
      } else {
        this.Storage.getFile(this.props.document, codeDir).then((data) => {
          this.setState({
            code: data,
            html: data,
          });
        });
      }
    }
  }
  render() {
    return (
      <Tabs
        id="ViewportTabs"
        currentTabId="now"
        tabs={[
          {
            heading: "Now hosting",
            title: "live priview",
            id: "now",
            childerns: (
              <div style={{ height: "93%", marginTop: "-3%" }}>
                <Now></Now>
              </div>
            ),
          },
          {
            heading: "View your file in iframe",
            title: "iframe preview",
            id: "wb",
            childerns: (
              <div style={{ height: "93%", marginTop: "-3%" }}>
                <iframe
                  title="page view"
                  className="Fill"
                  key={this.state.index}
                  srcDoc={this.state.html}
                ></iframe>
              </div>
            ),
          },
          {
            heading: "Preview your code",
            title: "code view",
            id: "cd",
            childerns: (
              <div>
                <Scrollbars style={{ height: "90%" }} autoHide>
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
                      getTokenProps,
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
                </Scrollbars>
              </div>
            ),
          },
        ]}
        betweenComponent={<div style={{ marginTop: 20 }} />}
      />
    );
  }
}

export default Viewport;
