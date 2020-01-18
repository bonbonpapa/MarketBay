import React, { Component } from "react";

class Profile extends Component {
  render() {
    return (
      <div className="card center ">
        <ul>
          {this.props.historyList.map(item => {
            return <li>{"Description: " + item.description}</li>;
          })}
        </ul>
      </div>
    );
  }
}
export default Profile;
