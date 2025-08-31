import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import "./ComplaintForm.scss";

const ComplaintForm = () => {
  const [againstUsername, setAgainstUsername] = useState(""); 
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/complaints", { againstUsername, message });
      setSuccess("Complaint submitted successfully!");
      setMessage("");
      setAgainstUsername("");
      setError(null);
    } catch (err) {
      setError(err?.response?.data || "Failed to submit complaint");
      setSuccess(null);
    }
  };

  return (
    <div className="complaint-form">
      <h2>Submit a Complaint</h2>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Against Username"
          value={againstUsername}
          onChange={(e) => setAgainstUsername(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your complaint..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send Complaint</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
