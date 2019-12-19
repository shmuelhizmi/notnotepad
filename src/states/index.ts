import { combineReducers, createStore } from "redux";
import NowStore from "./services/now";
import ThemeStore from "./theme";
export const Reducers = combineReducers({
  theme: ThemeStore,
  now: NowStore
});

export default createStore(
  Reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export interface action<T, D> {
  type: T;
  data: D;
}
