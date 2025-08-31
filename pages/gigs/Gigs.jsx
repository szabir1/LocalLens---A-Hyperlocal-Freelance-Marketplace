import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs({ currentUserId }) {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("all"); // default to "all"
  const [location, setLocation] = useState("");

  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  // Fetch gigs using react-query
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", sort, category, location, minRef.current?.value, maxRef.current?.value],
    queryFn: () => {
      // Build query string dynamically
      const min = minRef.current?.value || 0;
      const max = maxRef.current?.value || 9999;

      // Only include category if it's not "all"
      const catQuery = category && category !== "all" ? `&cat=${category}` : "";

      return newRequest
        .get(
          `/gigs${search}&min=${min}&max=${max}&sort=${sort}${catQuery}&location=${location}`
        )
        .then((res) => res.data);
    },
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    refetch();
  };

  const handleDelete = (id) => {
    refetch(); // refresh list after delete
  };

  useEffect(() => {
    refetch();
  }, [sort, category, location]);

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">LocalLens &gt; Graphics & Design &gt;</span>

        <h1>AI Artists</h1>
        <p>Explore the boundaries of art and technology with LocalLens AI artists</p>

        <div className="menu">
          <div className="left">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All</option>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>

            <span>Location</span>
            <input
              type="text"
              placeholder="e.g. Dhaka"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>

          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">{sort === "sales" ? "Best Selling" : "Newest"}</span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort !== "createdAt" && <span onClick={() => reSort("createdAt")}>Newest</span>}
                {sort !== "sales" && <span onClick={() => reSort("sales")}>Best Selling</span>}
              </div>
            )}
          </div>
        </div>

        <div className="cards">
          {isLoading
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data.map((gig) => (
                <GigCard
                  key={gig._id}
                  item={gig}
                  currentUserId={currentUserId}
                  onDelete={handleDelete}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
