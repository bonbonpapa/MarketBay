import React, { Component } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import AllItems from "./AllItems.jsx";
import ItemDetails from "./ItemDetails.jsx";
import Profile from "./Profile.jsx";
import Pay from "./Pay.jsx";
import ShoppingList from "./ShoppingList.jsx";
import UpdateItem from "./UpdateItem.jsx";

import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

class App extends Component {
  constructor(props) {
    super(props);
  }
  renderAllItems = () => {
    return (
      <div>
        <AllItems />
      </div>
    );
  };
  renderItemDetails = rd => {
    let itemId = rd.match.params.itemId;
    let itemCandiates = this.props.items.filter(item => {
      return item._id === itemId;
    });
    return <ItemDetails contents={itemCandiates[0]} />;
  };

  clearShoppingList = () => {
    this.props.dispatch({ type: "clear-shoppinglist" });
  };
  setShoppingHistory = list => {
    this.setState({
      shoppingHistory: this.state.shoppingHistory.concat(list)
    });
  };
  updatePaymentInfo = cardinfo => {
    this.setState({
      paymentInfo: cardinfo
    });
  };

  renderShoppingCart = () => {
    return <ShoppingList />;
  };

  renderProfile = () => {
    return <Profile historyList={this.state.shoppingHistory} />;
  };
  renderPay = () => {
    return (
      <Pay list={this.state.shoppingList} payinfo={this.updatePaymentInfo} />
    );
  };
  renderUpdateItem = () => {
    return <UpdateItem />;
  };

  render = () => {
    if (this.props.lgin) {
      return (
        <BrowserRouter>
          <div>
            <div>
              <Link to={"/"}>My home page </Link>
            </div>
            <div>
              <Link to={"/shoppingcart"}> Link to shopping cart </Link>
            </div>
            <div>
              <Link to={"/profile"}> Link to profile cart </Link>
            </div>
            <div>
              <Link to={"/updateItems/"}>Update selling items</Link>
            </div>
            <Route exact={true} path="/" render={this.renderAllItems} />
            <Route
              exact={true}
              path="/shoppingcart"
              render={this.renderShoppingCart}
            />
            <Route exact={true} path="/profile" render={this.renderProfile} />
            <Route exact={true} path="/pay" render={this.renderPay} />
            <Route
              exact={true}
              path="/updateItems/"
              render={this.renderUpdateItem}
            />
            <Route
              exact={true}
              path="/details/:itemId"
              render={this.renderItemDetails}
            />
          </div>
        </BrowserRouter>
      );
    }
    return (
      <div className="signform">
        <h1>Signup</h1>
        <Signup />
        <h1>Login</h1>
        <Login />
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    lgin: state.loggedIn,
    username: state.username,
    items: state.items
  };
};
export default connect(mapStateToProps)(App);
