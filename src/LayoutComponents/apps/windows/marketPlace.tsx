import React, { Component } from "react";
import { Button } from "@blueprintjs/core";
import { addApp, app } from "../appStorage";
import ReactJson from "react-json-view";
import Scrollbars from "react-custom-scrollbars";
interface MarketPlaceState {
  app: app | any;
}
export default class MarketPlace extends Component<{}, MarketPlaceState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      app: {
        name: "exmple app",
        url: "www.exmple.app",
        type: "app",
        appID: "com.exmple.app",
        permissions: {
          read: false,
          write: false,
          delete: false,
          message: true,
          launchApp: false,
          installAps: true
        }
      }
    };
  }
  render() {
    return (
      <div>
        <Scrollbars autoHeight autoHide>
          <ReactJson
            theme="bright"
            src={this.state.app}
            onEdit={e => {
              if (typeof e.existing_value === typeof e.new_value) {
                this.setState({ app: e.updated_src });
              } else {
                return false;
              }
            }}
          ></ReactJson>
        </Scrollbars>
        <Button
          text="install"
          onClick={() => {
            addApp(this.state.app);
          }}
          fill
          large
        ></Button>
      </div>
    );
  }
}
