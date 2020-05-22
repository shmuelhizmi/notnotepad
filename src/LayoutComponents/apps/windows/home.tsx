import React, { Component } from "react";
import { getInstalledApps, app, appTypes } from "../appStorage";
import { ControlGroupTabs } from "../../../UIComponents/tabs";
import {
  Tag,
  ControlGroup,
  H3,
  Card,
  Divider,
  Colors,
  InputGroup,
  Button,
} from "@blueprintjs/core";
import Scrollbars from "react-custom-scrollbars";
import { appService } from "../appView/app";

interface homeState {
  filterKey: string;
}
interface homeProps {
  launchApp: (app: app) => void;
  listRunningServices: () => appService[];
  stopRunningService: (id: number) => void;
}
export default class Home extends Component<homeProps, homeState> {
  constructor(props: homeProps) {
    super(props);
    this.state = {
      filterKey: "",
    };
  }
  private listApps(type: appTypes, updateOnClick?: boolean) {
    return getInstalledApps().map((v, i) => {
      if (
        (!this.state.filterKey || v.name.includes(this.state.filterKey)) &&
        v.type === type
      ) {
        return (
          <div key={i}>
            <Divider />
            <Card
              title={v.name}
              interactive
              onClick={() => {
                this.props.launchApp(v);
                if (updateOnClick) {
                  this.forceUpdate();
                }
              }}
            >
              <div
                style={{
                  display: "inline-grid",
                  gridTemplateColumns: "35px auto auto",
                }}
              >
                <AppIcon name={v.name} iconUrl={v.iconUrl}></AppIcon>
                <Divider />
                <H3 style={{ color: Colors.COBALT4 }}>{v.name}</H3>
              </div>
            </Card>
          </div>
        );
      }
      return <div key={i}></div>;
    });
  }
  render() {
    return (
      <div>
        <ControlGroupTabs
          betweenComponent={
            <div>
              <Divider />
              <InputGroup
                placeholder="filter"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this.setState({ filterKey: e.target.value });
                }}
              ></InputGroup>
            </div>
          }
          currentTabId="apps"
          id="homeView"
          tabs={[
            {
              title: "apps",
              heading: "view your apps",
              id: "apps",
              childerns: (
                <Scrollbars autoHeight autoHide>
                  {this.listApps("app")}
                </Scrollbars>
              ),
            },
            {
              title: "services",
              heading: "view your services",
              id: "services",
              childerns: (
                <Scrollbars autoHeight autoHide>
                  {this.props.listRunningServices().map((service, i) => {
                    const app = service.getApp();
                    return (
                      <div key={i}>
                        <ControlGroup>
                          <AppIcon
                            name={app.name}
                            iconUrl={app.iconUrl}
                          ></AppIcon>
                          <Button
                            text="STOP"
                            fill
                            onClick={() => {
                              this.props.stopRunningService(i);
                              this.forceUpdate();
                            }}
                          ></Button>
                        </ControlGroup>
                      </div>
                    );
                  })}
                  {this.listApps("service", true)}
                </Scrollbars>
              ),
            },
            {
              id: "editors",
              title: "editors",
              heading: "view your editors",
              childerns: (
                <Scrollbars autoHeight autoHide>
                  {this.listApps("editor")}
                </Scrollbars>
              ),
            },
          ]}
        />
      </div>
    );
  }
}

const AppIcon = (props: { name: string; iconUrl?: string }) => {
  return (
    <Tag minimal>
      <img height={20} width={20} alt={props.name} src={props.iconUrl}></img>
    </Tag>
  );
};
