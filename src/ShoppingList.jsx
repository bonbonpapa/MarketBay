import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class ShoppingList extends Component {
  OnCheckoutItems = () => {};
  DeletefromShoppingList = idx => {
    this.props.dispatch({ type: "delete-from-list", content: idx });
  };

  render() {
    return (
      <div className="card center ">
        <ul>
          {this.props.shoppingList.map((item, idx) => (
            <li>
              <Link to={"/details/" + item._id}>{item.description}</Link>
              <button onClick={() => this.DeletefromShoppingList(idx)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
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
let mapStateToProps = state => {
  return {
    shoppingList: state.shoppingList
  };
};
export default connect(mapStateToProps)(ShoppingList);
