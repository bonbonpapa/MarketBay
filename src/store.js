import React, { Component } from "react";
import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, username: action.content };
  }
  if (action.type === "set-items") {
    return { ...state, items: action.content };
  }
  if (action.type === "add-shoppinglist") {
    return {
      ...state,
      shoppingList: state.shoppingList.concat(action.content)
    };
  }

  if (action.type === "clear-shoppinglist") {
    return {
      ...state,
      shoppingList: []
    };
  }
  if (action.type === "delete-from-list") {
    const cartCopy = state.shoppingList.slice();
    cartCopy.splice(action.content, 1);
    return {
      ...state,
      shoppingList: cartCopy
    };
  }
  return state;
};
const store = createStore(
  reducer,
  {
    loggedIn: false,
    username: undefined,
    items: [],
    shoppingList: [],
    shoppingHistory: [],
    paymentInfo: {}
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
