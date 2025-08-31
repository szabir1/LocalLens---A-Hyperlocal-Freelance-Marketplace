import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const userId = currentUser?._id || currentUser?.id; // ✅ works for _id or id
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Optional: kick unauthenticated users to login
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myGigs", userId],
    queryFn: async () => {
      const res = await newRequest.get(`/gigs?userId=${userId}`);
      return res.data;
    },
    enabled: !!userId, // ✅ only run when we actually have a userId
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGigs", userId] });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this gig?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        "Loading..."
      ) : isError ? (
        "Failed to load gigs."
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {currentUser?.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>

          {!data || data.length === 0 ? (
            <p>No gigs yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((gig) => (
                  <tr key={gig._id}>
                    <td>
                      <img className="image" src={gig.cover} alt={gig.title} />
                    </td>
                    <td>{gig.title}</td>
                    <td>${gig.price}</td>
                    <td>{gig.sales ?? 0}</td>
                    <td>
                      <img
                        className="delete"
                        src="./img/delete.png"
                        alt="delete"
                        onClick={() => handleDelete(gig._id)}
                        role="button"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default MyGigs;
