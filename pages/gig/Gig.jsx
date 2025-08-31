import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch single gig
  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  // Fetch seller info
  const { isLoading: isLoadingUser, error: errorUser, data: dataUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  // Delete gig handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    try {
      await newRequest.delete(`/gigs/${id}`);
      alert("Gig deleted successfully!");
      queryClient.invalidateQueries(["gigs"]);
      navigate("/gigs");
    } catch (err) {
      console.error(err);
      alert("Failed to delete gig.");
    }
  };

  // Contact seller handler
  const handleContact = async () => {
    if (!currentUser) {
      alert("Please login first!");
      return;
    }
    if (!data?.userId) {
      alert("Seller information not loaded yet.");
      return;
    }
    if (currentUser._id === data.userId) {
      alert("You cannot contact yourself!");
      return;
    }

    try {
      // Create or get conversation with seller
      const res = await newRequest.get(`/conversations/orcreate/${data.userId}`);
      if (res?.data?._id) {
        navigate(`/message/${res.data._id}`); // ✅ Corrected: use _id
      } else {
        alert("Could not create conversation. Try again later.");
      }
    } catch (err) {
      console.error("Failed to open conversation:", err);
      alert("Failed to open conversation");
    }
  };

  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          {/* Left panel */}
          <div className="left">
            <span className="breadcrumbs">LocalLens &gt; Graphics & Design &gt;</span>
            <h1>{data.title}</h1>

            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img className="pp" src={dataUser.img || "/img/noavatar.png"} alt="" />
                <span>{dataUser.username}</span>
                {data.starNumber > 0 && !isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((_, i) => (
                        <img src="/img/star.png" alt="" key={i} />
                      ))}
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Contact Me button */}
            {currentUser?._id !== data?.userId && (
              <button className="contact-btn" onClick={handleContact}>
                Contact Me
              </button>
            )}

            {/* Slider */}
            {Array.isArray(data?.images) && data.images.length > 0 ? (
              <Slider slidesToShow={1} arrowsScroll={1} className="slider">
                {data.images.map((img) => (
                  <img key={img} src={img} alt="" />
                ))}
              </Slider>
            ) : (
              <div className="no-images">
                <img src="/img/noimage.png" alt="No gig images available" />
              </div>
            )}

            <h2>About This Gig</h2>
            <p>{data.desc}</p>

            {/* Seller info */}
            {isLoadingUser || errorUser ? null : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={dataUser.img || "/img/noavatar.png"} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {data.starNumber > 0 && !isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((_, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>{Math.round(data.totalStars / data.starNumber)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">Aug 2022</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Last delivery</span>
                      <span className="desc">1 day</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}

            <Reviews gigId={id} />
          </div>

          {/* Right panel */}
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>$ {data.price}</h2>
            </div>
            <p>{data.shortDesc}</p>

            <div className="details">
              <div className="item">
                <img src="/img/clock.png" alt="" />
                <span>{data.deliveryTime} Days Delivery</span>
              </div>
              <div className="item">
                <img src="/img/recycle.png" alt="" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>

            <div className="features">
              {Array.isArray(data?.features) && data.features.length > 0 ? (
                data.features.map((feature) => (
                  <div className="item" key={feature}>
                    <img src="/img/greencheck.png" alt="" />
                    <span>{feature}</span>
                  </div>
                ))
              ) : (
                <p>No features listed for this gig.</p>
              )}
            </div>

            {/* Delete button visible only for seller */}
            {currentUser?._id === data.userId && (
              <button className="delete-btn" onClick={handleDelete}>
                Delete Gig
              </button>
            )}

            <Link to={`/pay/${id}`}>
              <button>Continue</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
