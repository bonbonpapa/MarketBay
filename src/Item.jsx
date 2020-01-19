import React, { Component } from "react";
import { Link } from "react-router-dom";
import MediaItem from "./MediaItem.jsx";

class Item extends Component {
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
            return (
              <div>
                {obj} - {frontendPaths[obj]}
                <MediaItem mid={frontendPaths[obj]} />
              </div>
            );
          })}
        </div>
        <div>
          <div>Description: {description}</div>
          <div>Price: {price} $</div>
          <div>Inventory: {inventory}</div>
          <div>Location: {location}</div>
          <div>Seller: {seller}</div>
          <div>
            <Link to={"/details/" + this.props.contents._id}>
              Link to details
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default Item;
