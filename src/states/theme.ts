import { Theme, THEMES } from "../WindowsLayout";
import { action } from "./index";

export default (
  state = THEMES["Blueprint Dark"],
  action: action<string, string>
) => {
  if (action.type === "theme_update") {
    return action.data;
  }
  return state;
};
