import { combineReducers, createStore } from "redux";
import NowStore from "./services/now";
export const Reducers = combineReducers({
  now: NowStore
});

export default createStore(
  Reducers);
export interface action<T, D> {
  type: T;
  data: D;
}
