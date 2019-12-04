import React, { Component } from "react";
import { Button, IPanelProps, PanelStack } from "@blueprintjs/core";
import StorageManager from "../Storage/storageManager";
import Now from "./now";
export default class DeployNow extends IPanelProps {
  constructor(props) {
    super(props);
    this.Storage = new StorageManager("Storage Manager");
    this.Token = this.Storage.getToken("now");
    this.state = {};
  }
  setToken = token => {
    this.Token = token;
  };
  render() {
    if (this.Token) {
    }
  }
}
