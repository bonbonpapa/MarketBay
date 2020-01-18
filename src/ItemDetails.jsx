import React, { Component } from "react";
import { Link } from "react-router-dom";

import { reviews } from "./Data.js";

class ItemDetails extends Component {
  addToShoppingList = () => {
    this.props.addToShoppingList(this.props.item);
  };

  render() {
    let reviewsforitem = reviews.filter(review => {
      return review.itemId === this.props.item.id;
    });

    let reviewdetails = "";

    reviewdetails =
      reviewsforitem.length === 0 ? (
        <div>No reviews for this item.</div>
      ) : (
        reviewsforitem.map(review => {
          return (
            <div>
              <div>{review.contents}</div>
              <Link to={"/reviewer/" + review.reviewer}>
                {" "}
                From {review.reviewer}{" "}
              </Link>
            </div>
          );
        })
      );

    return (
      <div>
        <div className="card center ">
          <img height="100px" src={this.props.item.image} />
          <div>
            <div>{"Inventory: " + this.props.item.inventory}</div>
            {/* <button type="button" onClick={this.addToShoppingList}> */}
            <button
              type="button"
              onClick={() => {
                this.addToShoppingList();
              }}
            >
              Add to cart
            </button>
            <h3>Reviews for this item</h3>
            {reviewdetails}
          </div>
        </div>
      </div>
    );
  }
}
export default ItemDetails;
