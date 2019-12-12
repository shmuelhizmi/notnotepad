import React from "react";
import CodeEditor from "../../CodeEditor";

import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import * as Showdown from "showdown";
import Scrollbars from "react-custom-scrollbars";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

export default class MDEDitor extends CodeEditor {
  componentDidMount = () => {
    this.setState({ editor: "MDEditor" });
  };
  onEditorChange = newValue => {
    this.saveEditorCode(newValue);
    this.setState({ code: newValue });
  };
  render() {
    return (
      <div style={{ backgroundColor: "#fff", color: "#000" }}>
        <Scrollbars ref="scrollbars" style={{ height: "100%" }}>
          <ReactMde
            minEditorHeight={1080}
            maxEditorHeight={99990}
            selectedTab={this.state.selectedTab || "write"}
            onTabChange={tab => {
              this.setState({ selectedTab: tab });
            }}
            value={this.state.code}
            onChange={this.onEditorChange}
            generateMarkdownPreview={markdown =>
              Promise.resolve(converter.makeHtml(markdown))
            }
          />
        </Scrollbars>
      </div>
    );
  }
}
