// src/pages/admin/ComplaintList.jsx
import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import "./ComplaintList.scss";

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [replies, setReplies] = useState({}); // store replies per complaint

  const fetchComplaints = async () => {
    try {
      const res = await newRequest.get("/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplies(prev => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = async (id) => {
    try {
      await newRequest.put(`/complaints/${id}/reply`, { reply: replies[id] });
      setReplies(prev => ({ ...prev, [id]: "" }));
      fetchComplaints(); // refresh list
      alert("Reply sent!");
    } catch (err) {
      alert("Failed to send reply.");
    }
  };

  return (
    <div className="complaint-list">
      <h2>Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints yet.</p>
      ) : (
        complaints.map((c) => (
          <div key={c._id} className="complaint-card">
            <p><strong>From:</strong> {c.senderId?.username || "Unknown"}</p>
            <p><strong>Against:</strong> {c.againstId?.username || "Unknown"}</p>
            <p><strong>Message:</strong> {c.message}</p>
            <p><strong>Reply:</strong> {c.reply || "No reply yet"}</p>

            <input
              type="text"
              placeholder="Reply..."
              value={replies[c._id] || ""}
              onChange={(e) => handleReplyChange(c._id, e.target.value)}
            />
            <button onClick={() => handleReplySubmit(c._id)}>Send Reply</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ComplaintList;
