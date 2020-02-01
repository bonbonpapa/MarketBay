import React, { Component } from "react";
import styled from "styled-components";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import AllItems from "./AllItems.jsx";
import ItemDetails from "./ItemDetails.jsx";
import Profile from "./Profile.jsx";
import Pay from "./Pay.jsx";
import ShoppingList from "./ShoppingList.jsx";
import UpdateItem from "./UpdateItem.jsx";
import Navbar from "./Navbar.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import SignInSide from "./SignInSide.js";
import SellSide from "./SellSide.js";
import Cart from "./Cart.js";
import Purchased from "./Purchased.js";
import PrimarySearchAppBar from "./PrimarySearchAppBar.js";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 100px 1fr;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  componentDidMount() {
    this.fetchSession();
  }
  fetchSession = async () => {
    this.setState({ loading: true });

    const response = await fetch("/session");
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      this.props.dispatch({ type: "login-success", content: parsed.username });
    }
    this.setState({ loading: false });
  };
  renderAllItems = () => {
    return <AllItems />;
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

  renderShoppingCart = () => {
    //  return <ShoppingList />;
    return <Cart />;
  };

  renderProfile = () => {
    // return <Profile />;
    return <Purchased />;
  };
  renderPay = () => {
    return <Pay />;
  };
  renderUpdateItem = () => {
    // return <UpdateItem />;
    return <SellSide />;
  };

  render = () => {
    if (this.props.lgin) {
      return (
        <BrowserRouter>
          <Wrapper>
            {/* <Navbar /> */}
            <PrimarySearchAppBar />
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
          </Wrapper>
        </BrowserRouter>
      );
    }
    return (
      // <div className="signform">
      //   <h1>Signup</h1>
      //   <Signup />
      //   <h1>Login</h1>
      //   <Login />
      // </div>
      <div>
        <SignInSide />
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
