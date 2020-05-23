import React, { Component } from "react";
import WindowsLayout, { Theme } from "./WindowsLayout";
import { BrowserRouter, Switch, Route, useParams } from "react-router-dom";
import { Provider } from "react-redux";

import REDUXSTORE from "./states";

class WebRouter extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Provider store={REDUXSTORE}>
                <WindowsLayout theme={"nnp"}></WindowsLayout>
              </Provider>
            </Route>
            <Route exact path="/theme/:theme">
              <ThemeRouter />
            </Route>
            <Route exact path="/apps/">
              <div>AAA</div>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
const ThemeRouter = () => {
  const { theme } = useParams();
  let selectedTheme: Theme = "nnp";
  if (theme.includes("dark")) {
    selectedTheme = "dark";
  }
  if (theme.includes("light")) {
    selectedTheme = "light";
  }
  if (theme.includes("nnp")) {
    selectedTheme = "nnp";
  }
  return (
    <Provider store={REDUXSTORE}>
      <WindowsLayout theme={selectedTheme}></WindowsLayout>
    </Provider>
  );
};
export default WebRouter;
