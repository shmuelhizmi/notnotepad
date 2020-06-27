import { Action, Permissions, Actions } from "./appView/app";
import StorageManager from "../../Storage/storageManager";
import { app } from "./appStorage";
import { IToaster } from "@blueprintjs/core";

export type Handler<
  Request extends keyof Actions,
  Respones extends keyof Actions
> = (props: {
  resolve: (res: Action<Actions[Respones]>) => void;
  reject: (error: Error) => void;
  action: Action<Actions[Request]>;
  permissions: Permissions;
  aditinalInfo?: {
    openFile?: string;
    launchApp?: (appId: string) => void;
  };
  storage: StorageManager;
  addApp: (app: app) => void;
  toaster: IToaster;
}) => void;

const noPermissionError = (misssingPermission: string) =>
  new Error(`Error: missing permission - ${misssingPermission}`);

export const getOpenFile: Handler<"getOpenFile", "getOpenFileResponse"> = ({
  resolve,
  reject,
  action,
  permissions,
  aditinalInfo,
  storage,
}) => {
  if (permissions.getOpenFile) {
    if (aditinalInfo && aditinalInfo.openFile) {
      const message: Actions["getOpenFile"] = action.data;
      const fileData = storage.syncGetFile(
        aditinalInfo.openFile,
        message.storage
      );
      const res: Action<Actions["getOpenFileResponse"]> = {
        id: action.id,
        type: action.type,
        data: { data: fileData },
      };
      resolve(res);
    }
  } else {
    reject(noPermissionError("getOpenFile"));
  }
};

export const setOpenFile: Handler<"setOpenFile", "setOpenFileResponse"> = ({
  resolve,
  reject,
  action,
  permissions,
  aditinalInfo,
  storage,
}) => {
  if (permissions.setOpenFile) {
    if (aditinalInfo && aditinalInfo.openFile) {
      const message: Actions["setOpenFile"] = action.data;
      storage
        .setFile(aditinalInfo.openFile, message.data, message.storage)
        .then(() => {
          const res: Action<Actions["setOpenFileResponse"]> = {
            id: action.id,
            type: action.type,
            data: { success: true },
          };
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    }
  } else {
    reject(noPermissionError("setOpenFile"));
  }
};

export const installApps: Handler<"installApp", "installAppResponse"> = ({
  resolve,
  reject,
  action,
  permissions,
  aditinalInfo,
  storage,
  addApp,
}) => {
  if (permissions.installApps) {
    const message: Actions["installApp"] = action.data;
    addApp(message.app);
    const res: Action<Actions["installAppResponse"]> = {
      type: action.type,
      id: action.id,
      data: { success: true },
    };
    resolve(res);
  } else {
    reject(noPermissionError("installApps"));
  }
};

export const launchApp: Handler<"launchApp", "launchAppResponse"> = ({
  resolve,
  reject,
  action,
  permissions,
  aditinalInfo,
  storage,
  addApp,
}) => {
  if (permissions.launchApp) {
    if (aditinalInfo && aditinalInfo.launchApp) {
      const message: Actions["launchApp"] = action.data;
      aditinalInfo.launchApp(message.appId);
      const res: Action<Actions["launchAppResponse"]> = {
        type: action.type,
        id: action.id,
        data: { success: true },
      };
      resolve(res);
    }
  } else {
    reject(noPermissionError("launchApp"));
  }
};

export const message: Handler<"message", "messageResponse"> = ({
  resolve,
  reject,
  action,
  permissions,
  aditinalInfo,
  storage,
  addApp,
  toaster,
}) => {
  if (permissions.message) {
    const message: Actions["message"] = action.data;
    toaster.show({
      message: message.message,
      intent: message.intent,
      icon: message.icon,
    });
    const res: Action<Actions["messageResponse"]> = {
      id: action.id,
      type: "message_response",
      data: { success: true },
    };
    resolve(res);
  } else {
    reject(noPermissionError("message"));
  }
};

export const read: Handler<"read", "readResponse"> = ({
  resolve,
  reject,
  action,
  permissions,
  aditinalInfo,
  storage,
  addApp,
  toaster,
}) => {
  if (permissions.read) {
    const message: Actions["read"] = action.data;
    const res: Action<Actions["readResponse"]> = {
      type: action.type,
      id: action.id,
      data: { data: storage.syncGetFile(message.path, message.storage) },
    };
    resolve(res);
  } else {
    reject(noPermissionError("read"));
  }
};

export const write: Handler<"write", "writeResponse"> = ({
  resolve,
  reject,
  action,
  permissions,
  aditinalInfo,
  storage,
  addApp,
  toaster,
}) => {
  if (permissions.write) {
    const message: Actions["write"] = action.data;
    storage.setFile(message.path, message.data, message.storage).then(() => {
      const res: Action<Actions["writeResponse"]> = {
        type: action.type,
        id: action.id,
        data: { success: true },
      };
      resolve(res);
    });
  } else {
    reject(noPermissionError("write"));
  }
};

export const deleteAction: Handler<"delete", "deleteResponse"> = ({
  // cant use delete
  resolve,
  reject,
  action,
  permissions,
  aditinalInfo,
  storage,
  addApp,
  toaster,
}) => {
  if (permissions.delete) {
    const message: Actions["delete"] = action.data;
    storage.removeDocument(message.path).then(() => {
      const res: Action<Actions["deleteResponse"]> = {
        type: action.type,
        id: action.id,
        data: { success: true },
      };
      resolve(res);
    });
  } else {
    reject(noPermissionError("delete"));
  }
};

export default {
  getOpenFile,
  setOpenFile,
  installApps,
  launchApp,
  message,
  read,
  write,
  delete: deleteAction,
};
