import React, { Component } from "react";
import Item from "./Item.jsx";
import { connect } from "react-redux";
class AllItems extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = event => {
    this.reload();
  };
  reload = async () => {
    let response = await fetch("/all-items");
    let body = await response.text();
    console.log("/all-items response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({ type: "set-items", content: body.items });
    }
  };

  render = () => {
    return (
      <div>
        <button onClick={this.reload}> load </button>
        <div>
          {this.props.items.map(item => (
            <Item key={item._id} contents={item} />
          ))}
        </div>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    username: state.username,
    items: state.items
  };
};
export default connect(mapStateToProps)(AllItems);
