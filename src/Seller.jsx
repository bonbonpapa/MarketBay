import React, { Component } from "react";
import { Link } from "react-router-dom";

class Seller extends Component {
  render() {
    let sellId = this.props.seller.id;

    let itemsofSeller = this.props.items.filter(item => {
      return item.sellerId === sellId;
    });

    let itemsdetails = "";

    itemsdetails =
      itemsofSeller.length === 0 ? (
        <div>No items for seller.</div>
      ) : (
        itemsofSeller.map(item => {
          return (
            <li>
              <img width="60px" src={item.image} />
              <Link to={"/details/" + item.id}> Link to details </Link>
            </li>
          );
        })
      );

    return (
      <div className="card center">
        <h3>Items by {this.props.seller.name} :</h3>
        <div>{this.props.seller.name}</div>
        <div>{this.props.seller.rating}</div>
        <ul>{itemsdetails}</ul>
        <div>
          <Link to={"/updateItems/" + this.props.seller.id}>
            Update selling items
          </Link>
        </div>
      </div>
    );
  }
}
export default Seller;
