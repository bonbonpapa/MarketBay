import React, { Component } from "react";
import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return {
      ...state,
      loggedIn: true,
      username: action.content,
      userId: action.userId
    };
  }
  if (action.type === "log-out") {
    return {
      ...state,
      loggedIn: false,
      username: undefined,
      userId: undefined
    };
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
  if (action.type === "set-items-bought") {
    return {
      ...state,
      shoppingHistory: state.shoppingHistory.concat(action.content)
    };
  }

  if (action.type === "clear-shoppinglist") {
    return {
      ...state,
      cart: null
    };
  }
  if (action.type === "delete-from-list") {
    const cartCopy = state.cart.products.slice();
    cartCopy.splice(action.content, 1);
    return {
      ...state,
      cart: { ...state.cart, products: cartCopy }
    };
  }
  if (action.type === "init-card") {
    const cardinit = { cardnumber: "", cvv: "", expdate: "" };
    return {
      ...state,
      card: cardinit
    };
  }
  if (action.type === "set-card") {
    return {
      ...state,
      card: action.content
    };
  }
  if (action.type === "set-shippingaddress") {
    return {
      ...state,
      shippingAddress: action.content
    };
  }
  if (action.type === "clear-shippingAddress") {
    return {
      ...state,
      shippingAddress: ""
    };
  }
  if (action.type === "set-cardnumber") {
    const cardCopy = { ...state.card };
    cardCopy["cardnumber"] === action.content;
    return {
      ...state,
      card: cardCopy
    };
  }
  if (action.type === "set-cvv") {
    const cardCopy = { ...state.card };
    cardCopy["cvv"] === action.content;
    return {
      ...state,
      card: cardCopy
    };
  }
  if (action.type === "set-expdate") {
    const cardCopy = { ...state.card };
    cardCopy["expdate"] === action.content;
    return {
      ...state,
      card: cardCopy
    };
  }
  if (action.type === "query") {
    return {
      ...state,
      searchQuery: action.content
    };
  }
  if (action.type === "set-cart") {
    return {
      ...state,
      cart: action.content
    };
  }
  return state;
};
const store = createStore(
  reducer,
  {
    loggedIn: false,
    username: undefined,
    userId: undefined,
    items: [],
    shoppingList: [],
    cart: null,
    shoppingHistory: [],
    shippingAddress: "",
    searchQuery: "",
    card: null
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
