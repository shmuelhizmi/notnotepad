import StorageManager, { configDir } from "../../Storage/storageManager";
import { Permissions } from "./appView/app";

const storage = new StorageManager();

export interface app {
  name: string;
  appID: string;
  type: appTypes;
  url: string;
  permissions: Permissions;
  iconUrl?: string;
}
export type appTypes = "app" | "service" | "editor";
export const appsLocation = "installedApps.json";

export const defualtApps: app[] = [
  {
    name: "message test",
    iconUrl: "https://img.icons8.com/flat_round/50/000000/read-message.png",
    permissions: { message: true },
    type: "app",
    url: "./apps/messageTest.html",
    appID: "com.mesgtest.nnp"
  },
  {
    name: "dummy image gen",
    iconUrl: "https://img.icons8.com/nolan/64/000000/sign-up.png",
    permissions: { message: true, write: true },
    type: "app",
    url: "./apps/dummy.html",
    appID: "com.dummygen.nnp"
  },
  {
    name: "GAME",
    iconUrl: "https://img.icons8.com/doodle/48/000000/controller--v1.png",
    permissions: {},
    type: "app",
    url: "./apps/game.html",
    appID: "com.testgame.nnp"
  },
  {
    name: "service message test",
    iconUrl: "https://img.icons8.com/carbon-copy/50/000000/service.png",
    permissions: { message: true },
    type: "service",
    url: "./apps/messageTest.js",
    appID: "com.servicemesgtest.nnp"
  }
];

export const getInstalledApps: () => app[] = () => {
  return JSON.parse(
    storage.syncGetFile(appsLocation, configDir, JSON.stringify([]))
  ).concat(defualtApps);
};
export const addApp = (app: app) => {
  let apps = getInstalledApps();
  apps.push(app);
  storage.setFile(appsLocation, JSON.stringify(apps), configDir);
};
