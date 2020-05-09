import React, { Component } from "react";
import { Colors, Navbar, Button, Tabs, Tab } from "@blueprintjs/core";
import Home from "./windows/home";
import MarketPlace from "./windows/marketPlace";
import { AppView, appService } from "./appView/app";
import { app } from "./appStorage";
import { IconsTabs } from "../../UIComponents/tabs";

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
      currentApp: null,
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
        <IconsTabs
          currentTabId="home"
          tabs={[
            {
              id: "home",
              childerns: (
                <Home
                  stopRunningService={this.stopService}
                  listRunningServices={() => this.activeServices}
                  launchApp={this.launchApp}
                />
              ),
              heading: "Home",
              icon: "home",
            },
            {
              id: "mp",
              childerns: <MarketPlace />,
              heading: "Market Place",
              icon: "shop",
            },
            {
              id: "app",
              childerns: this.state.currentApp ? (
                <AppView
                  url={this.state.currentApp.url}
                  appPermissions={this.state.currentApp.permissions}
                />
              ) : (
                <div />
              ),
              heading: "Application",
              icon: "application",
            },
          ]}
        />
      </div>
    );
  }
}
