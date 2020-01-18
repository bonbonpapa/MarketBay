import React, { Component } from "react";

import { reviews } from "./Data.js";
class ReviewerDetails extends Component {
  render() {
    let reviewsofReviewer = reviews.filter(review => {
      return review.reviewer === this.props.reviewer;
    });

    let reviewdetails = "";

    reviewdetails =
      reviewsofReviewer.length === 0 ? (
        <div>No reviews for user.</div>
      ) : (
        reviewsofReviewer.map(review => {
          let itemtoDisplay = this.props.items.find(item => {
            return item.id === review.itemId;
          });
          return (
            <li>
              <img height="40px" src={itemtoDisplay.image} />
              {' with comment "' + review.contents + '"'}
            </li>
          );
        })
      );

    return (
      <div className="card center ">
        <div>
          <h3>Reviews by {this.props.reviewer.toUpperCase()} :</h3>
          <ul>{reviewdetails}</ul>
        </div>
      </div>
    );
  }
}
export default ReviewerDetails;
