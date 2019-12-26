import React, { Component } from "react";
import { Intent, Toaster, Position, IconName } from "@blueprintjs/core";
import Axios, { AxiosResponse } from "axios";
import { app, addApp } from "../appStorage";
import StorageManager from "../../../Storage/storageManager";

const storage = new StorageManager();

export interface permissions {
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
  installAps?: boolean;
  launchApp?: boolean;
}
interface action<T> {
  type: string;
  id: number;
  data: T;
}
interface actionGetOpenFile {
  storage: "codeDir" | "editorDir";
}
interface actionGetOpenFileResponse {
  data: string;
}
interface actionSetOpenFile {
  data: string;
  storage: "codeDir" | "editorDir";
}
interface actionSetOpenFileResponse {
  success: boolean;
}
interface actionRead {
  storage: "codeDir" | "editorDir";
  path: string;
}
interface actionReadResponse {
  data: string;
}
interface actionWrite {
  storage: "codeDir" | "editorDir";
  path: string;
  data: string;
}
interface actionWriteResponse {
  success: boolean;
}
interface actionDelete {
  path: string;
}
interface actionDeleteResponse {
  success: boolean;
}
interface actionMessage {
  message: string;
  intent?: Intent;
  icon?: IconName;
}
interface actionMessageResponse {
  success: boolean;
}
interface actionLaunchApp {
  appId: string;
}
interface actionLaunchAppResponse {
  success: boolean;
}
interface actionInstallApp {
  app: app;
}
interface actionInstallAppResponse {
  success: boolean;
}

interface AppProps {
  appPermissions: permissions;
  url: string;
}
interface AppState {
  appPermissions: permissions;
  url: string;
}
const makeAction = (
  action: action<any>,
  permissions: permissions,
  aditinalInfo?: {
    openFile?: string;
    launchApp?: (appId: string) => void;
  }
) => {
  return new Promise(
    (resolve: (res: action<any>) => void, reject: (e: Error) => void) => {
      switch (action.type) {
        case "getOpenFile": {
          if (permissions.getOpenFile) {
            if (aditinalInfo && aditinalInfo.openFile) {
              const message: actionGetOpenFile = action.data;
              const fileData = storage.syncGetFile(
                aditinalInfo.openFile,
                message.storage
              );
              const res: action<actionGetOpenFileResponse> = {
                id: action.id,
                type: action.type,
                data: { data: fileData }
              };
              resolve(res);
            }
          }
          break;
        }
        case "setOpenFile": {
          if (permissions.setOpenFile) {
            if (aditinalInfo && aditinalInfo.openFile) {
              const message: actionSetOpenFile = action.data;
              storage
                .setFile(aditinalInfo.openFile, message.data, message.storage)
                .then(() => {
                  const res: action<actionSetOpenFileResponse> = {
                    id: action.id,
                    type: action.type,
                    data: { success: true }
                  };
                  resolve(res);
                })
                .catch(e => {
                  reject(e);
                });
            }
          }
          break;
        }
        case "installAps": {
          if (permissions.installAps) {
            const message: actionInstallApp = action.data;
            addApp(message.app);
            const res: action<actionInstallAppResponse> = {
              type: action.type,
              id: action.id,
              data: { success: true }
            };
            resolve(res);
          }
          break;
        }
        case "launchApp": {
          if (permissions.launchApp) {
            if (aditinalInfo && aditinalInfo.launchApp) {
              const message: actionLaunchApp = action.data;
              aditinalInfo.launchApp(message.appId);
              const res: action<actionLaunchAppResponse> = {
                type: action.type,
                id: action.id,
                data: { success: true }
              };
              resolve(res);
            }
          }
          break;
        }

        case "message": {
          if (permissions.message) {
            const message: actionMessage = action.data;
            Toster.show({
              message: message.message,
              intent: message.intent,
              icon: message.icon
            });
            const res: action<actionMessageResponse> = {
              id: action.id,
              type: "message_response",
              data: { success: true }
            };
            resolve(res);
          }
          break;
        }
        case "read": {
          if (permissions.read) {
            const message: actionRead = action.data;
            const res: action<actionReadResponse> = {
              type: action.type,
              id: action.id,
              data: { data: storage.syncGetFile(message.path, message.storage) }
            };
            resolve(res);
          }
          break;
        }
        case "write": {
          if (permissions.write) {
            const message: actionWrite = action.data;
            storage
              .setFile(message.path, message.data, message.storage)
              .then(() => {
                const res: action<actionWriteResponse> = {
                  type: action.type,
                  id: action.id,
                  data: { success: true }
                };
                resolve(res);
              });
          }
          break;
        }
        case "delete": {
          if (permissions.delete) {
            const message: actionDelete = action.data;
            storage.removeDocument(message.path).then(() => {
              const res: action<actionDeleteResponse> = {
                type: action.type,
                id: action.id,
                data: { success: true }
              };
              resolve(res);
            });
          }
          break;
        }
      }
    }
  );
};

const onMessageWindow = (
  event: MessageEvent,
  permissions: permissions,
  sender: Window
) => {
  if (event.data.type && event.data.data) {
    if (
      typeof event.data.type === "string" &&
      typeof event.data.data === "object"
    ) {
      const action: action<any> = event.data;
      makeAction(action, permissions).then((res: action<any>) => {
        sendMessageWindow(res, sender);
      });
    }
  }
};
const sendMessageWindow = (action: action<any>, app: Window) => {
  app.postMessage(action, app.location.origin);
};

const onMessageWorker = (
  event: MessageEvent,
  permissions: permissions,
  sender: Worker
) => {
  if (event.data.type && event.data.data) {
    if (
      typeof event.data.type === "string" &&
      typeof event.data.data === "object"
    ) {
      const action: action<any> = event.data;
      makeAction(action, permissions).then((res: action<any>) => {
        sendMessageWorker(res, sender);
      });
    }
  }
};
const sendMessageWorker = (action: action<any>, worker: Worker) => {
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
  appPermissions: permissions;
  app: app;
  service: Worker | undefined;
  constructor(props: app) {
    this.url = props.url;
    this.appPermissions = props.permissions;
    this.app = props;
    makeWorker(this.url).then(worker => {
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
      appPermissions: props.appPermissions
    };
    this.appFrame = React.createRef();
    window.addEventListener("message", this.onMessage, false);
  }
  componentDidMount = () => {
    if (this.appFrame.current) {
      if (this.appFrame.current.contentWindow) {
        this.appFrame.current.contentWindow.onmessage = this.onMessage;
      }
    }
  };
  onMessage = (event: MessageEvent) => {
    if (this.appFrame.current) {
      if (this.appFrame.current.contentWindow) {
        onMessageWindow(
          event,
          this.state.appPermissions,
          this.appFrame.current.contentWindow
        );
      }
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
export const Toster = Toaster.create({
  className: "recipe-toaster",
  position: Position.BOTTOM_RIGHT,
  maxToasts: 5
});
