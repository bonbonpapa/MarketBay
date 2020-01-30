import React, { component, Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 5px;
  background: #4caf50;
`;

const Logo = styled.div`
  text-align: center;
  img {
    max-width: 80px;
  }
`;

const NavbarLink = styled(Link)`
  color: #fff;
  text-decoration: none;
`;

class Navbar extends Component {
  render() {
    return (
      <Wrapper>
        <NavbarLink to="/">Go to home</NavbarLink>
        <div className="nav-right">
          <NavbarLink to="/updateItems">Sell</NavbarLink>
          <NavbarLink to="/profile">Profile</NavbarLink>
          <Link to="/shoppingcart" className="cart">
            <img src="/cart.svg" />
            <span>{this.props.shoppingList.length}</span>
          </Link>
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
export default connect(mapStateToProps)(Navbar);
