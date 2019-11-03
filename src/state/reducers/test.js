import { createStore } from "redux";

const testReducer = (state = 0, action) => {
  switch (action.type) {
    case "test+":
      return state + 1;

    case "test-":
      return state - 1;
  }
};

export const testStore = createStore(
  testReducer,
  +window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
