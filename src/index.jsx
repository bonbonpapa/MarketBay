import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import "./main.css";
import App from "./App.jsx";
import React from "react";
import reloadMagic from "./reload-magic-client.js"; // automatic reload
import GlobalStyle from "./GlobalStyle.js";
reloadMagic(); // automatic reload

ReactDOM.render(
  <Provider store={store}>
    <>
      <GlobalStyle />
      <App />
    </>
  </Provider>,
  document.getElementById("root")
);
