import React from "react";
import "./Review.scss";

const Review = ({ review }) => {
  const user = review.userId;

  return (
    <div className="review">
      <div className="user">
        <img className="pp" src={user.img || "/img/noavatar.png"} alt="" />
        <div className="info">
          <span>{user.username}</span>
          {user.country && (
            <div className="country">
              <span>{user.country}</span>
            </div>
          )}
        </div>
      </div>

      <div className="stars">
        {Array(review.star)
          .fill()
          .map((_, i) => (
            <img src="/img/star.png" alt="" key={i} />
          ))}
        <span>{review.star}</span>
      </div>

      <p>{review.desc}</p>

      <div className="helpful">
        <span>Helpful?</span>
        <img src="/img/like.png" alt="" />
        <span>Yes</span>
        <img src="/img/dislike.png" alt="" />
        <span>No</span>
      </div>
    </div>
  );
};

export default Review;
