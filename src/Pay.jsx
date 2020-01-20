import React, { Component } from "react";
import { connect } from "react-redux";

class Pay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardnumber: "",
      cvv: "",
      expdata: "",
      shippingAddress: ""
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    alert(
      `${this.state.cardnumber} - ${this.state.expdata} - ${this.state.cvv}- ${this.state.shippingAddress}`
    );
    this.setState({
      cardnumber: "",
      cvv: "",
      expdata: "",
      shippingAddress: ""
    });
    this.props.dispatch({ type: "set-items-bought" });
    this.props.dispatch({ type: "clear-shoppinglist" });
  };
  updateCardNumber = event => {
    this.setState({ cardnumber: event.target.value });
  };
  updateCVV = event => {
    this.setState({ cvv: event.target.value });
  };
  updateExpDate = event => {
    this.setState({ expdata: event.target.value });
  };
  updateAddress = event => {
    this.setState({ shippingAddress: event.target.value });
  };
  render() {
    return (
      <div className="card center ">
        <form onSubmit={this.handleSubmit}>
          <div>
            Card Number:
            <input
              type="text"
              value={this.state.cardnumber}
              onChange={this.updateCardNumber}
            />
          </div>
          <div>
            CVV:
            <input
              type="text"
              value={this.state.cvv}
              onChange={this.updateCVV}
            />
          </div>
          <div>
            Expire Date:
            <input
              type="text"
              value={this.state.expdata}
              onChange={this.updateExpDate}
            />
          </div>
          <div>
            Shipping Address:
            <input
              type="text"
              value={this.state.shippingAddress}
              onChange={this.updateAddress}
            />
          </div>

          <input type="submit" />
        </form>
      </div>
    );
  }
}
export default connect()(Pay);
