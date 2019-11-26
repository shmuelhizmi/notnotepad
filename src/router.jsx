import React, { Component } from "react";
import WindowsLayout from "./WindowsLayout";
import StoragePageView from "./Storage/storagePageView";
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
              <CreateStoragePageView></CreateStoragePageView>
            </Router>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default WebRouter;

const CreateStoragePageView = () => {
  const location = useLocation();
  const pageName = location.pathname.replace("/webView/", "");
  return <StoragePageView page={pageName} objectPath="code"></StoragePageView>;
};
