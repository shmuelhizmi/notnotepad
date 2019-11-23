import React, { Component } from "react";
import WindowsLayout from "./WindowsLayout";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";
class WebRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/">
              <WindowsLayout></WindowsLayout>
            </Route>
            <Router exact path="/webView/:page">
              <StoragePageView></StoragePageView>
            </Router>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default WebRouter;

const StoragePageView = () => {
  const location = useLocation();
  const pageName = location.pathname.replace("/webView/", "");
  const pageData = JSON.parse(localStorage.getItem(pageName));
  return (
    <iframe title="webPreview" srcDoc={pageData.code} className="Fill"></iframe>
  );
};
