import React, { Component } from "react";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Seller from "./Seller.jsx";
import Item from "./Item.jsx";
import ItemDetails from "./ItemDetails.jsx";
import Profile from "./Profile.jsx";
import Pay from "./Pay.jsx";
import ReviewerDetails from "./ReviewerDetails.jsx";
import ShoppingList from "./ShoppingList.jsx";
import UpdateItem from "./UpdateItem.jsx";
import { initialItems, initialSellers, reviews } from "./Data.js";

import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: initialItems,
      shoppingList: [],
      shoppingHistory: [],
      paymentInfo: {}
    };
  }
  renderAllItems = () => {
    return (
      <div>
        {this.state.items.map(item => (
          <Item
            cost={item.price}
            sellerId={item.sellerId}
            imageLocation={item.image}
            description={item.description}
            itemId={item.id}
          />
        ))}
        <div className="card center ">
          <Link to={"/sellers"}> Link to all sellers </Link>
        </div>
      </div>
    );
  };
  renderItemDetails = (rd, addtoShoppingList) => {
    let itemId = rd.match.params.itemId;
    let itemCandiates = this.state.items.filter(item => {
      return item.id === itemId;
    });
    return (
      <ItemDetails
        item={itemCandiates[0]}
        addToShoppingList={addtoShoppingList}
        items={this.state.items}
      />
    );
  };

  renderSeller = routerData => {
    let sellerId = routerData.match.params.sid;
    let candidates = initialSellers.filter(seller => {
      return seller.id === sellerId;
    });
    return <Seller seller={candidates[0]} items={this.state.items} />;
  };

  renderAllSellers = () => {
    return (
      <div className="card center ">
        <h3>All Sellers :</h3>
        <ul>
          {initialSellers.map(seeler => {
            return (
              <li>
                <Link to={"/seller/" + seeler.id}> Seller: {seeler.name} </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  renderReviewer = rd => {
    let reviewer = rd.match.params.itemId;

    return <ReviewerDetails reviewer={reviewer} items={this.state.items} />;
  };
  addtoShoppingList = item => {
    this.setState({
      shoppingList: this.state.shoppingList.concat(item)
    });
  };

  DeletefromShoppingList = item => {
    this.setState({
      shoppingList: this.state.shoppingList.filter(itemlist => {
        return !(itemlist === item);
      })
    });
  };

  clearShoppingList = () => {
    this.setState({
      shoppingList: []
    });
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
  updateItems = item => {
    this.setState({
      items: this.state.items.concat(item)
    });
  };

  renderShoppingCart = rd => {
    return (
      <ShoppingList
        list={this.state.shoppingList}
        deletefromList={this.DeletefromShoppingList}
        clearList={this.clearShoppingList}
        setHistory={this.setShoppingHistory}
      />
    );
  };

  renderProfile = () => {
    return <Profile historyList={this.state.shoppingHistory} />;
  };
  renderPay = () => {
    return (
      <Pay list={this.state.shoppingList} payinfo={this.updatePaymentInfo} />
    );
  };
  renderUpdateItem = rd => {
    const sellerId = rd.match.params.sid;
    return (
      <UpdateItem
        items={this.state.items}
        updateItem={this.updateItems}
        sellerId={sellerId}
      />
    );
  };

  renderShoppingList = rd =>
    this.renderShoppingCart(rd, this.DeletefromShoppingList);
  renderItems = rd => this.renderItemDetails(rd, this.addtoShoppingList);

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
            <Route exact={true} path="/" render={this.renderAllItems} />
            <Route
              exact={true}
              path="/sellers"
              render={this.renderAllSellers}
            />
            <Route
              exact={true}
              path="/shoppingcart"
              render={this.renderShoppingList}
            />
            <Route exact={true} path="/profile" render={this.renderProfile} />
            <Route exact={true} path="/pay" render={this.renderPay} />
            <Route
              exact={true}
              path="/seller/:sid"
              render={this.renderSeller}
            />
            <Route
              exact={true}
              path="/updateItems/:sid"
              render={this.renderUpdateItem}
            />
            <Route
              exact={true}
              path="/details/:itemId"
              render={this.renderItems}
            />
            <Route
              exact={true}
              path="/reviewer/:itemId"
              render={this.renderReviewer}
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
    lgin: state.loggedIn
  };
};
export default connect(mapStateToProps)(App);
