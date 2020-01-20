import React, { Component } from "react";
import { connect } from "react-redux";
class Profile extends Component {
  render() {
    return (
      <div className="card center ">
        <ul>
          {this.props.shoppingHistory.map(item => {
            return <li>{"Description: " + item.description}</li>;
          })}
        </ul>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    shoppingHistory: state.shoppingHistory
  };
};
export default connect(mapStateToProps)(Profile);
