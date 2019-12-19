import React, { Component } from "react";
import WindowsLayout from "./WindowsLayout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import REDUXSTORE from "./states";

class WebRouter extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/">
              <Provider store={REDUXSTORE}>
                <WindowsLayout></WindowsLayout>
              </Provider>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default WebRouter;
