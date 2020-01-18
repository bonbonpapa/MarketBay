import React, { Component } from "react";
import { Link } from "react-router-dom";
import ItemInCart from "./ItemInCart.jsx";

class ShoppingList extends Component {
  OnCheckoutItems = () => {
    this.props.setHistory(this.props.list);
    this.props.clearList();
  };

  render() {
    return (
      <div className="card center ">
        {this.props.list.map(item => (
          <ItemInCart
            item={item}
            deleteItemInCart={this.props.deletefromList}
          />
        ))}
        <button type="button" onClick={this.OnCheckoutItems}>
          Confirm order
        </button>
        <div>
          <Link to={"/pay"}>Payment Here</Link>
        </div>
      </div>
    );
  }
}
export default ShoppingList;
