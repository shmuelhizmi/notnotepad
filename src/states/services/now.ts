import { combineReducers } from "redux";
import { action } from "../index";

const isNowEnabled = (state = false, action: action<string, {}>) => {
  switch (action.type) {
    case "now_enable": {
      return true;
    }
    case "now_disable": {
      return false;
    }
  }

  return state;
};

export const nowToken = (
  state: string = "",
  action: action<string, string>
) => {
  if (action.type === "now_updateToken") {
    return action.data;
  }
  return state;
};
export const nowUrl = (state: string = "", action: action<string, string>) => {
  if (action.type === "now_updateUrl") {
    return action.data;
  }
  return state;
};
export default combineReducers({
  enabled: isNowEnabled,
  url: nowUrl,
  token: nowToken
});

export const setNowEnable: (enable: boolean) => action<string, {}> = (
  enable: boolean = false
) => ({
  type: enable ? "now_enable" : "now_disable",
  data: {}
});
export const setNowToken: (token: string) => action<string, string> = (
  token: string
) => {
  return {
    type: "now_updateToken",
    data: token
  };
};
export const setNowUrl: (url: string) => action<string, string> = (
  url: string
) => {
  return {
    type: "now_updateUrl",
    data: url
  };
};
