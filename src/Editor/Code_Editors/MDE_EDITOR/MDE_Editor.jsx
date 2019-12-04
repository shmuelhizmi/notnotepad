import React, { Component } from "react";
import CodeEditor from "../../CodeEditor";

import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import * as Showdown from "showdown";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

export default class MDEDitor extends CodeEditor {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    this.setState({ editor: "MDEditor" });
  };
  onEditorChange = newValue => {
    this.saveEditorData(newValue);
    this.setState({ code: newValue });
  };
  render() {
    const data = this.getEditorData().code;
    return (
      <div style={{ backgroundColor: "#fff", color: "#000" }}>
        <ReactMde
          maxEditorHeight={9999}
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
      </div>
    );
  }
}
