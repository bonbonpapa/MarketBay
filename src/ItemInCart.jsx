import React, { Component } from "react";

class ItemInCart extends Component {
  deletefromShoppingList = () => {
    this.props.deleteItemInCart(this.props.item);
  };
  render() {
    return (
      <div>
        <li>{"Description: " + this.props.item.description}</li>
        <button type="button" onClick={this.deletefromShoppingList}>
          Delete
        </button>
      </div>
    );
  }
}
export default ItemInCart;
