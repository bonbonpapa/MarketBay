import React, { Component } from "react";
import MediaItem from "./MediaItem.jsx";
import styled from "styled-components";
import { connect } from "react-redux";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 60% 1fr;
  grid-gap: 20px;
`;

class ItemDetails extends Component {
  addtoShoppingList = async () => {
    // this.props.dispatch({
    //   type: "add-shoppinglist",
    //   content: this.props.contents
    // });
    // here it is to communicate with server to add product to cart (if cart existed, if no, created a cart for the user)
    let formData = new FormData();
    formData.append("userId", this.props.userId);
    formData.append("quantity", 1);
    formData.append("productId", this.props.contents._id);
    formData.append("description", this.props.contents.description);
    formData.append("price", this.props.contents.price);

    let response = await fetch("/add-cart", { method: "POST", body: formData });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("new Cart returned, ", body.cart);
      this.props.dispatch({ type: "set-cart", content: body.cart });
      alert("items added CART successfully!");
    } else alert("Something went wrong with the cart");
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
      <Wrapper>
        <div>
          {Object.keys(this.props.contents.frontendPaths).map((obj, i) => {
            return <MediaItem key={i} mid={frontendPaths[obj]} />;
          })}
        </div>
        <div>
          <h2>{description}</h2>
          <h3>$ {price} CAD</h3>
          <h3>{inventory < 10 ? "Limited Quantity" : "Hot Sale"}</h3>
          <button type="button" onClick={this.addtoShoppingList}>
            Add to cart
          </button>
        </div>
      </Wrapper>
    );
  }
}
let mapStateToProps = state => {
  return {
    shoppingList: state.shoppingList,
    userId: state.userId
  };
};
export default connect(mapStateToProps)(ItemDetails);
