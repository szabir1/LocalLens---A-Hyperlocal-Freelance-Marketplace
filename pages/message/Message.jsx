import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";

const Message = () => {
  const { id: convIdParam, sellerId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);
  const [users, setUsers] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch or create conversation
  useEffect(() => {
    if (!currentUser) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    const fetchConversation = async () => {
      try {
        let res;
        if (convIdParam) {
          res = await newRequest.get(`/conversations/single/${convIdParam}`);
        } else if (sellerId) {
          res = await newRequest.get(`/conversations/orcreate/${sellerId}`);
          if (res?.data?._id) navigate(`/message/${res.data._id}`, { replace: true });
        }
        setConversation(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load conversation.");
        navigate("/messages");
      }
    };

    fetchConversation();
  }, [convIdParam, sellerId, currentUser, navigate]);

  // Fetch messages
  const { data: messages } = useQuery({
    queryKey: ["messages", conversation?._id],
    queryFn: async () => {
      if (!conversation?._id) return [];
      const res = await newRequest.get(`/messages/${conversation._id}`);
      return res.data;
    },
    enabled: !!conversation,
  });

  // Fetch usernames of both participants (buyer and seller)
  useEffect(() => {
    if (!conversation) return;

    const fetchUsers = async () => {
      const ids = [conversation.buyerId, conversation.sellerId];
      const usersData = {};
      await Promise.all(
        ids.map(async (uid) => {
          const res = await newRequest.get(`/users/${uid}`);
          usersData[uid] = res.data.username;
        })
      );
      setUsers(usersData);
    };

    fetchUsers();
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mutation to send a message
  const mutation = useMutation({
    mutationFn: (message) => newRequest.post("/messages", message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversation?._id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!conversation) return;

    const desc = e.target[0].value.trim();
    if (!desc) return;

    mutation.mutate({ conversationId: conversation._id, desc });
    e.target[0].value = "";
  };

  if (!conversation || !users[conversation.buyerId] || !users[conversation.sellerId]) {
    return <div>Loading conversation...</div>;
  }

  // Determine other participant's ID
  const otherUserId = currentUser.isSeller ? conversation.buyerId : conversation.sellerId;

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> &gt; {users[otherUserId]}
        </span>

        <div className="messages">
          {messages?.length === 0 ? (
            <div className="no-messages">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((m) => (
              <div
                key={m._id}
                className={m.userId === currentUser._id ? "owner item" : "item"}
              >
                <img
                  src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p>
                  <strong>
                    {m.userId === currentUser._id ? "You" : users[m.userId] || "Unknown"}:
                  </strong>{" "}
                  {m.desc}
                </p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <hr />

        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="Write a message..." />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
