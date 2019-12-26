import React, { Component } from "react";
import { Colors, Navbar, Button, Tabs, Tab } from "@blueprintjs/core";
import Home from "./windows/home";
import MarketPlace from "./windows/marketPlace";
import { AppView, appService } from "./appView/app";
import { app } from "./appStorage";

interface AppLauncherProps {}
interface AppLauncherState {
  activeWindows: activeWindowsType;
  currentApp: app | null;
}
type activeWindowsType = "home" | "mp" | "app";
export default class AppLauncher extends Component<
  AppLauncherProps,
  AppLauncherState
> {
  activeServices: appService[];
  constructor(props: AppLauncherProps) {
    super(props);
    this.state = {
      activeWindows: "home",
      currentApp: null
    };
    this.activeServices = [];
  }
  changeLocation = (window: activeWindowsType) => {
    this.setState({ activeWindows: window });
  };
  launchApp = (app: app) => {
    switch (app.type) {
      case "app": {
        this.setState({ currentApp: app });
        this.changeLocation("app");
        break;
      }
      case "service": {
        const worker = new appService(app);
        this.activeServices.push(worker);
        break;
      }
    }
  };
  stopService = (id: number) => {
    this.activeServices[id].stop();
    this.activeServices.splice(id, 1);
  };
  render() {
    return (
      <div style={{ backgroundColor: Colors.DARK_GRAY2, height: "100%" }}>
        <Navbar>
          <Navbar.Group>
            <Navbar.Heading>Extensions</Navbar.Heading>
            <Navbar.Divider />
            <Button
              minimal
              icon="home"
              onClick={() => this.changeLocation("home")}
            />
            <Button
              minimal
              icon="shop"
              onClick={() => this.changeLocation("mp")}
            />
            <Button
              minimal
              icon="application"
              onClick={() => this.changeLocation("app")}
            />
          </Navbar.Group>
        </Navbar>
        {
          <Tabs
            selectedTabId={this.state.activeWindows}
            renderActiveTabPanelOnly
          >
            <Tab
              id="home"
              panel={
                <Home
                  stopRunningService={this.stopService}
                  listRunningServices={() => this.activeServices}
                  launchApp={this.launchApp}
                />
              }
            ></Tab>
            <Tab id="mp" panel={<MarketPlace />}></Tab>
            <Tab
              id="app"
              panel={
                this.state.currentApp ? (
                  <AppView
                    url={this.state.currentApp.url}
                    appPermissions={this.state.currentApp.permissions}
                  />
                ) : (
                  <div />
                )
              }
            ></Tab>
          </Tabs>
        }
      </div>
    );
  }
}
