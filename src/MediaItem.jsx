import React, { Component } from "react";

class MediaItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mpath: {}
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
