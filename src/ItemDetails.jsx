import React, { Component } from "react";
import MediaItem from "./MediaItem.jsx";
import { connect } from "react-redux";

class ItemDetails extends Component {
  addtoShoppingList = () => {
    this.props.dispatch({
      type: "add-shoppinglist",
      content: this.props.contents
    });
  };

  render() {
    const {
      description,
      price,
      inventory,
      location,
      seller,
      frontendPaths
    } = this.props.contents;
    return (
      <div className="card center ">
        <div>
          {Object.keys(this.props.contents.frontendPaths).map((obj, i) => {
            return <MediaItem key={i} mid={frontendPaths[obj]} />;
          })}
        </div>
        <div>
          <div>Description: {description}</div>
          <div>Price: {price} $</div>
          <div>Inventory: {inventory}</div>
          <div>Location: {location}</div>
          <div>Seller: {seller}</div>
        </div>
        <div>
          <button type="button" onClick={this.addtoShoppingList}>
            Add to cart
          </button>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    shoppingList: state.shoppingList
  };
};
export default connect(mapStateToProps)(ItemDetails);
