import React, { Component } from "react";

class UpdateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      description: "",
      price: "",
      inventory: "",
      image: "",
      sellerId: this.props.sellerId
    };
  }

  InitialState = () => {
    this.setState({
      id: "",
      description: "",
      price: "",
      inventory: "",
      image: ""
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    const item = {
      id: this.state.id,
      description: this.state.description,
      price: this.state.price,
      inventory: this.state.inventory,
      image: this.state.image,
      sellerId: this.state.sellerId
    };
    this.props.updateItem(item);

    this.InitialState();
  };
  updateID = event => {
    this.setState({ id: event.target.value });
  };
  updateDesc = event => {
    this.setState({ description: event.target.value });
  };
  updatePrice = event => {
    this.setState({ price: event.target.value });
  };
  updateInventory = event => {
    this.setState({ inventory: event.target.value });
  };
  handleImageChange = event => {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        image: reader.result
      });
    };

    reader.readAsDataURL(file);

    // get the code for image handling from stack flow post
  };

  render() {
    return (
      <div className="card center ">
        <form onSubmit={this.handleSubmit}>
          <div>
            Item ID:
            <input type="text" value={this.state.id} onChange={this.updateID} />
          </div>
          <div>
            Description:
            <input
              type="text"
              value={this.state.description}
              onChange={this.updateDesc}
            />
          </div>
          <div>
            Price:
            <input
              type="text"
              value={this.state.price}
              onChange={this.updatePrice}
            />
          </div>
          <div>
            Inventory:
            <input
              type="text"
              value={this.state.inventory}
              onChange={this.updateInventory}
            />
          </div>
          <div>
            Image:
            <input
              type="file"
              onChange={event => this.handleImageChange(event)}
            />
          </div>
          <input type="submit" />
        </form>
      </div>
    );
  }
}
export default UpdateItem;
