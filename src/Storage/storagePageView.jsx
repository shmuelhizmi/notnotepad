import React, { Component } from "react";

import StorageManager from "./storageManager";

class StoragePageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page,
      objectPath: props.objectPath,
      pageData: ""
    };
    this.Storage = new StorageManager("Storage Manager");
  }
  componentDidMount = () => {
    this.update();
  };
  update = async () => {
    const pageData = this.Storage.getFile(this.state.page)[
      this.state.objectPath
    ];
    if (pageData != this.state.pageData) {
      this.setState({ pageData: pageData });
    }
    setTimeout(() => {
      this.update();
    }, 1000);
  };
  render() {
    return (
      <iframe
        title={this.state.page}
        srcDoc={this.state.pageData}
        className="Fill"
      ></iframe>
    );
  }
}

export default StoragePageView;
