import React, { Component } from "react";
import { Intent, Toaster, Position, IconName } from "@blueprintjs/core";
import Axios, { AxiosResponse } from "axios";
import { app, addApp } from "../appStorage";
import StorageManager from "../../../Storage/storageManager";
import handlers, { Handler } from "../actionHandlers";

const storage = StorageManager;

export interface Permissions {
  //state
  getOpenFile?: boolean;
  setOpenFile?: boolean;
  //storage
  read?: boolean;
  write?: boolean;
  delete?: boolean;
  //ui
  message?: boolean;
  //apps
  installApps?: boolean;
  launchApp?: boolean;
}
export interface Action<T> {
  type: string;
  id: number;
  data: T;
}
export interface Actions {
  getOpenFile: {
    storage: "codeDir" | "editorDir";
  };
  getOpenFileResponse: {
    data: string;
  };
  setOpenFile: {
    data: string;
    storage: "codeDir" | "editorDir";
  };
  setOpenFileResponse: {
    success: boolean;
  };
  read: {
    storage: "codeDir" | "editorDir";
    path: string;
  };
  readResponse: {
    data: string;
  };
  write: {
    storage: "codeDir" | "editorDir";
    path: string;
    data: string;
  };
  writeResponse: {
    success: boolean;
  };
  delete: {
    path: string;
  };
  deleteResponse: {
    success: boolean;
  };
  message: {
    message: string;
    intent?: Intent;
    icon?: IconName;
  };
  messageResponse: {
    success: boolean;
  };
  launchApp: {
    appId: string;
  };
  launchAppResponse: {
    success: boolean;
  };
  installApp: {
    app: app;
  };
  installAppResponse: {
    success: boolean;
  };
}

interface AppProps {
  appPermissions: Permissions;
  url: string;
}
interface AppState {
  appPermissions: Permissions;
  url: string;
}
const makeAction = (
  action: Action<any>,
  permissions: Permissions,
  aditinalInfo?: {
    openFile?: string;
    launchApp?: (appId: string) => void;
  }
) => {
  return new Promise(
    (resolve: (res: Action<any>) => void, reject: (e: Error) => void) => {
      const handler: Handler<any, any> = handlers[action.type];
      handler({
        action,
        permissions,
        resolve,
        reject,
        storage,
        aditinalInfo,
        addApp,
        toaster,
      });
    }
  );
};

const onMessageWindow = (
  event: MessageEvent,
  permissions: Permissions,
  sender: Window
) => {
  if (event.data.type && event.data.data) {
    if (
      typeof event.data.type === "string" &&
      typeof event.data.data === "object"
    ) {
      const action: Action<any> = event.data;
      makeAction(action, permissions).then((res: Action<any>) => {
        sendMessageWindow(res, sender);
      });
    }
  }
};
const sendMessageWindow = (action: Action<any>, app: Window) => {
  app.postMessage(action, app.location.origin);
};

const onMessageWorker = (
  event: MessageEvent,
  permissions: Permissions,
  sender: Worker
) => {
  if (event.data.type && event.data.data) {
    if (
      typeof event.data.type === "string" &&
      typeof event.data.data === "object"
    ) {
      const action: Action<any> = event.data;
      makeAction(action, permissions).then((res: Action<any>) => {
        sendMessageWorker(res, sender);
      });
    }
  }
};
const sendMessageWorker = (action: Action<any>, worker: Worker) => {
  worker.postMessage(action);
};

const makeWorker = (url: string) => {
  return new Promise(
    (resolve: (worker: Worker) => void, reject: (e: any) => void) => {
      Axios.get(url, { responseType: "text" })
        .then((v: AxiosResponse<string>) => {
          resolve(
            new Worker(
              window.URL.createObjectURL(
                new Blob([v.data], { type: "text/javascript" })
              )
            )
          );
        })
        .catch(reject);
    }
  );
};

export class appService {
  url: string;
  appPermissions: Permissions;
  app: app;
  service: Worker | undefined;
  constructor(props: app) {
    this.url = props.url;
    this.appPermissions = props.permissions;
    this.app = props;
    makeWorker(this.url).then((worker) => {
      this.service = worker;
      if (this.service) {
        this.service.onmessage = this.onMessage;
      }
    });
  }

  stop = () => {
    if (this.service) {
      this.service.terminate();
    }
  };
  getApp = () => {
    return this.app;
  };
  onMessage = (event: MessageEvent) => {
    if (this.service) {
      onMessageWorker(event, this.appPermissions, this.service);
    }
  };
}

export class AppView extends Component<AppProps, AppState> {
  appFrame: React.RefObject<HTMLIFrameElement>;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      url: props.url,
      appPermissions: props.appPermissions,
    };
    this.appFrame = React.createRef();
    window.addEventListener("message", this.onMessage, false);
  }


  onMessage = (event: MessageEvent) => {
    if (this.appFrame.current && this.appFrame.current.contentWindow && event.source === this.appFrame.current.contentWindow) {
        onMessageWindow(
          event,
          this.state.appPermissions,
          this.appFrame.current.contentWindow
        );
    }
  };

  render() {
    return (
      <div>
        <iframe
          style={{ border: "none", width: "100%", height: "100%" }}
          title="app"
          ref={this.appFrame}
          src={this.state.url}
        ></iframe>
      </div>
    );
  }
}

export const toaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.BOTTOM_RIGHT,
  maxToasts: 5,
});
