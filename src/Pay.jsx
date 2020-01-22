import React, { Component } from "react";
import { connect } from "react-redux";

class Pay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardnumber: "",
      cvv: "",
      expdate: ""
    };
  }
  componentDidMount = event => {
    this.props.dispatch({ type: "init-card" });
  };

  handleSubmit = async event => {
    event.preventDefault();

    const cardcopy = {
      cardnumber: this.state.cardnumber,
      cvv: this.state.cvv,
      expdate: this.state.expdate
    };

    this.props.dispatch({ type: "set-card", content: cardcopy });

    let formData = new FormData();
    formData.append("items", this.props.shoppingList);
    formData.append("card", cardcopy);
    formData.append("shippingAddress", this.props.shippingAddress);
    formData.append("username", this.props.username);

    let response = await fetch("/order", { method: "POST", body: formData });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "set-items-bought",
        content: this.props.shoppingList
      });
      this.props.dispatch({ type: "clear-shoppinglist" });
      this.props.dispatch({ type: "init-card" });
      this.props.dispatch({ type: "clear-shippingAddress" });
      this.setState({
        cardnumber: "",
        cvv: "",
        expdate: ""
      });
      alert("Order confirmed!");
    }
  };
  updateCardNumber = event => {
    this.setState({ cardnumber: event.target.value });
  };
  updateCVV = event => {
    this.setState({ cvv: event.target.value });
  };
  updateExpDate = event => {
    this.setState({ expdate: event.target.value });
  };
  updateAddress = event => {
    this.props.dispatch({
      type: "set-shippingaddress",
      content: event.target.value
    });
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
              value={this.state.expdate}
              onChange={this.updateExpDate}
            />
          </div>
          <div>
            Shipping Address:
            <input
              type="text"
              value={this.props.shippingAddress}
              onChange={this.updateAddress}
            />
          </div>

          <input type="submit" />
        </form>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    shippingAddress: state.shippingAddress,
    shoppingList: state.shoppingList,
    card: state.card,
    username: state.username
  };
};
export default connect(mapStateToProps)(Pay);
