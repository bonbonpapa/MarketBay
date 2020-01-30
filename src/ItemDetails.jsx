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
    shoppingList: state.shoppingList
  };
};
export default connect(mapStateToProps)(ItemDetails);
