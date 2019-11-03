//react
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

//defualt styling
import "./index.css";

//firebase
import * as firebase from "firebase";

//test
import HtmlEditor from "./Editor/html_editor/HtmlEditor";
import { testStore } from "./state/reducers/test";

const firebaseConfig = {
  apiKey: "AIzaSyDk2TmMUiqmD-AVCKD2dZNW__AfN0EdRFE",
  authDomain: "hardy-pattern-239921.firebaseapp.com",
  databaseURL: "https://hardy-pattern-239921.firebaseio.com",
  projectId: "hardy-pattern-239921",
  storageBucket: "hardy-pattern-239921.appspot.com",
  messagingSenderId: "790984134789",
  appId: "1:790984134789:web:6e2d14fa63c6ce3013d9ec",
  measurementId: "G-QSE6M2LQQ1"
};

firebase.initializeApp(firebaseConfig);

const Store = testStore;
const Editor = <HtmlEditor></HtmlEditor>;

ReactDOM.render(Editor, document.getElementById("editor"));
//ReactDOM.render(<a>{Editor.state.Code}</a>, document.getElementById("code"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
