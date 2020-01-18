import React, { Component } from "react";
import { Link } from "react-router-dom";

class Item extends Component {
  render() {
    return (
      <div className="card center ">
        <img height="100px" src={this.props.imageLocation} />
        <div>
          <div>{"Description: " + this.props.description}</div>
          <div>{"Price: " + this.props.cost + "$"}</div>
          <div>
            <Link to={"/seller/" + this.props.sellerId}> Link to seller </Link>
          </div>
          <div>
            <Link to={"/details/" + this.props.itemId}> Link to details </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default Item;
