import React from "react";
import "./GigCard.scss";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const GigCard = ({ item }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch user info
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () => newRequest.get(`/users/${item.userId}`).then(res => res.data),
  });

  // Delete gig handler
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    try {
      await newRequest.delete(`/gigs/${item._id}`);
      alert("Gig deleted successfully!");
      queryClient.invalidateQueries(["gigs"]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete gig.");
    }
  };

  // Calculate average stars safely
  const averageStars = item.starNumber > 0 
    ? (item.totalStars / item.starNumber).toFixed(1)
    : 0;

  return (
    <div className="gigCard">
      <Link to={`/gig/${item._id}`} className="link">
        <img src={item.cover} alt="" className="cover-img"/>
        <div className="info">
          {isLoading ? (
            "loading"
          ) : error ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img src={data.img || "/img/noavatar.png"} alt="" />
              <div className="user-info">
                <span className="username">{data.username}</span>
                {data.location && <span className="location">{data.location}</span>}
              </div>
            </div>
          )}
          <p>{item.desc}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>{averageStars}</span>
          </div>

          {/* Delete button for seller */}
          {currentUser?._id === item.userId && (
            <button className="delete-btn" onClick={handleDelete}>
              Delete Gig
            </button>
          )}
        </div>
        <hr />
        <div className="detail">
          <img src="./img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>$ {item.price}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GigCard;
