import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./AdminComplaints.scss";

const AdminComplaints = () => {
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState({});
  
  // Fetch all complaints
  const { isLoading, error, data } = useQuery({
    queryKey: ["complaints"],
    queryFn: () => newRequest.get("/complaints").then(res => res.data),
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ complaintId, reply }) => newRequest.put(`/complaints/reply/${complaintId}`, { reply }),
    onSuccess: () => queryClient.invalidateQueries(["complaints"]),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (complaintId) => newRequest.delete(`/complaints/${complaintId}`),
    onSuccess: () => queryClient.invalidateQueries(["complaints"]),
  });

  const handleReplyChange = (id, value) => {
    setReplyText(prev => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = (id) => {
    if (!replyText[id]) return;
    replyMutation.mutate({ complaintId: id, reply: replyText[id] });
    setReplyText(prev => ({ ...prev, [id]: "" }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="adminComplaints">
      <h1>Manage Complaints</h1>
      {isLoading ? (
        "Loading complaints..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="complaintList">
          {data.map(complaint => (
            <div key={complaint._id} className="complaintCard">
              <div className="info">
                <p><strong>From:</strong> {complaint.userId}</p>
                <p><strong>Type:</strong> {complaint.type}</p>
                <p><strong>Message:</strong> {complaint.message}</p>
                {complaint.reply && <p><strong>Reply:</strong> {complaint.reply}</p>}
              </div>
              <div className="actions">
                <textarea
                  placeholder="Write a reply..."
                  value={replyText[complaint._id] || ""}
                  onChange={(e) => handleReplyChange(complaint._id, e.target.value)}
                />
                <button onClick={() => handleReplySubmit(complaint._id)}>Send Reply</button>
                <button className="delete" onClick={() => handleDelete(complaint._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
