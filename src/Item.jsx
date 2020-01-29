import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Card from "@material-ui/core/Card";

const ItemCard = styled(Card)`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

class Item extends Component {
  render() {
    const { description, price, defaultPaths } = this.props.contents;
    return (
      <ItemCard>
        <div>
          <img src={defaultPaths.frontendPath} />
        </div>
        <div>
          <div>{description}</div>
          <div>{price} $</div>
          <div>
            <Link to={"/details/" + this.props.contents._id}>
              Link to details
            </Link>
          </div>
        </div>
      </ItemCard>
    );
  }
}
export default Item;
