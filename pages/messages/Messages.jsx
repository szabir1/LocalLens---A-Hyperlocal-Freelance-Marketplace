import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const [usernames, setUsernames] = useState({});
  const [conversationsWithLastMsg, setConversationsWithLastMsg] = useState([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => newRequest.get(`/conversations`).then((res) => res.data),
  });

  // Fetch usernames for buyer/seller IDs
  useEffect(() => {
    const fetchUsernames = async () => {
      if (!data) return;
      const ids = [...new Set(data.flatMap((c) => [c.buyerId, c.sellerId]))];
      const usersData = {};
      await Promise.all(
        ids.map(async (id) => {
          const res = await newRequest.get(`/users/${id}`);
          usersData[id] = res.data.username;
        })
      );
      setUsernames(usersData);
    };
    fetchUsernames();
  }, [data]);

  // Fetch last message for each conversation
  useEffect(() => {
    const fetchLastMessages = async () => {
      if (!data) return;
      const convs = await Promise.all(
        data.map(async (c) => {
          const res = await newRequest.get(`/messages/${c._id}?limit=1&sort=desc`);
          return { ...c, lastMessage: res.data[0]?.desc || "" };
        })
      );
      setConversationsWithLastMsg(convs);
    };
    fetchLastMessages();
  }, [data]);

  const mutation = useMutation({
    mutationFn: (id) => newRequest.put(`/conversations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="messages">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {conversationsWithLastMsg.map((c) => (
                <tr
                  key={c._id}
                  className={
                    (currentUser.isSeller && !c.readBySeller) ||
                    (!currentUser.isSeller && !c.readByBuyer)
                      ? "active"
                      : ""
                  }
                >
                  <td>
                    {usernames[currentUser.isSeller ? c.buyerId : c.sellerId] ||
                      (currentUser.isSeller ? c.buyerId : c.sellerId)}
                  </td>
                  <td>
                    <Link to={`/message/${c._id}`} className="link">
                      {c.lastMessage?.substring(0, 100) || "No messages yet"}
                    </Link>
                  </td>
                  <td>{moment(c.updatedAt).fromNow()}</td>
                  <td>
                    {(currentUser.isSeller && !c.readBySeller) ||
                    (!currentUser.isSeller && !c.readByBuyer) ? (
                      <button onClick={() => handleRead(c._id)}>
                        Mark as Read
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;
