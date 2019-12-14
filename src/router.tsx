import React, { Component } from "react";
import WindowsLayout from "./WindowsLayout";
import PageView from "./Storage/storagePageView";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";

class WebRouter extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <WindowsLayout></WindowsLayout>
            </Route>
            <Route exact path="/webView/:page">
              <CreateStoragePageView></CreateStoragePageView>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default WebRouter;

const CreateStoragePageView = () => {
  const location = useLocation();
  const pageName = location.pathname.replace("/webView/", "");
  const page = new PageView(pageName);
  page.start();
  return <></>;
};
