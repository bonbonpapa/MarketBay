import React, { Component } from "react";

class MediaItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mpath: {},
      mfile: ""
    };
  }
  componentDidMount = () => {
    this.loadMedia();
  };
  loadMedia = async () => {
    let response = await fetch("/getmedia?mid=" + this.props.mid);
    let body = await response.text();
    console.log("/get-media response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.setState({ mpath: body.mpath });
    }
  };
  updateimgSelectHandler = event => {
    this.setState({ mfile: event.target.files[0] });
  };
  reloadMediaUpdate = event => {
    event.preventDefault();
    this.loadMedia();
  };
  imgSubmitHandler = event => {
    event.preventDefault();
    let data = new FormData();
    data.append("mfile", this.state.mfile);
    data.append("id", this.state.mpath._id);
    fetch("/updatemedia", { method: "POST", body: data });
  };

  render = () => {
    let filetype = this.state.mpath.filetype;

    if (filetype === "image/jpeg") {
      return (
        <div>
          <form>
            <img
              src={this.state.mpath.frontendPath}
              width="200px"
              height="200px"
            />
            {this.state.mpath.frontendPath}
            <label>
              Select Image
              <input type="file" onChange={this.updateimgSelectHandler} />
            </label>
            <button onClick={this.imgSubmitHandler}>Update image</button>
            <button type="button" onClick={this.reloadMediaUpdate}>
              reload image
            </button>
          </form>
        </div>
      );
    }
    if (filetype === "audio/mp3") {
      return (
        <div>
          <audio
            controls
            src={this.state.mpath.frontendPath}
            type={filetype}
          ></audio>
        </div>
      );
    }
    return <div>unknown file format</div>;
  };
}

export default MediaItem;
