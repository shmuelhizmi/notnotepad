import React, { Component } from "react";

import StorageManager, { codeDir } from "./storageManager_new";
import { Button } from "@blueprintjs/core";

class StoragePageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page,
      pageData: ""
    };
    this.Storage = new StorageManager();
  }
  updateCode() {
    this.Storage.getFile(this.state.page, codeDir).then(code => {
      console.log(code);
      this.setState({
        pageData: code
      });
    });
  }
  componentDidMount() {
    this.updateCode();
  }
  render() {
    return (
      <>
        <iframe
          title={this.state.page}
          srcDoc={this.state.pageData}
          className="Fill"
        ></iframe>
      </>
    );
  }
}

export default StoragePageView;
