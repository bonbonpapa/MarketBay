import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import StripeCheckout from "react-stripe-checkout";

class ShoppingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 0,
      name: ""
    };
  }
  DeletefromShoppingList = idx => {
    this.props.dispatch({ type: "delete-from-list", content: idx });
  };

  handleToken = async token => {
    console.log({ token });
    let product = {
      name: this.state.name,
      price: this.state.price
    };

    const response = await axios.post("/checkout", {
      token,
      product
    });
    const { status } = response.data;

    if (status === "success") {
      alert("Success! check emails for details!");
    } else {
      alert("Something went wrong!");

      //   let formData = new FormData();
      //   formData.append("product", product);
      //   formData.append("token", token);

      //   let response = await fetch("/checkout", { method: "POST", body: formData });
      //   let body = await response.text();
      //   body = JSON.parse(body);
      //   if (body.success) {
      //     alert("Success! check emails for details!");
      //   } else {
      //     alert("Something went wrong!");
      //   }
    }
  };

  componentDidMount = event => {
    let totalAmount = 0;
    this.props.shoppingList.forEach((item, idx) => {
      totalAmount += parseFloat(item.price);
    });
    if (this.props.shoppingList.length > 0) {
      this.setState({
        price: totalAmount,
        name: this.props.shoppingList[0].description
      });
    }
  };

  render() {
    return (
      <div>
        <ul>
          {this.props.shoppingList.map((item, idx) => {
            return (
              <li key={idx}>
                <Link to={"/details/" + item._id}>{item.description}</Link>
                <button onClick={() => this.DeletefromShoppingList(idx)}>
                  Remove
                </button>
              </li>
            );
          })}
          <div>Total price $: {this.state.price}</div>
        </ul>
        <div>
          {/* <Link to={"/pay"}>Payment Here</Link> */}
          <StripeCheckout
            stripeKey="pk_test_Od1JbkgXOi6lpyatgG3KaT8Z00pBw8C5ry"
            token={this.handleToken}
            billingAddress
            shippingAddress
            amount={this.state.price * 100}
          />
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
