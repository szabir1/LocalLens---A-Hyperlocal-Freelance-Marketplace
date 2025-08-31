import React, { useEffect, useState } from "react";
import "./AdminDashboard.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Check admin access
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/"); // Redirect non-admin users
    }
  }, [navigate]);

  // Fetch all metrics and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, gigsRes, ordersRes, messagesRes] = await Promise.all([
          newRequest.get("/admin/users", { withCredentials: true }),
          newRequest.get("/admin/gigs", { withCredentials: true }),
          newRequest.get("/admin/orders", { withCredentials: true }),
          newRequest.get("/admin/messages", { withCredentials: true }),
        ]);

        setUsers(usersRes.data);
        setFilteredUsers(usersRes.data);
        setGigs(gigsRes.data);
        setOrders(ordersRes.data);
        setMessages(messagesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch metrics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle ban user
  const handleBan = async (id) => {
    try {
      await newRequest.put(`/admin/ban/${id}`, {}, { withCredentials: true });
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, isBanned: true } : user))
      );
      setFilteredUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, isBanned: true } : user))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to ban user");
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      )
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (isLoading) return <div className="admin-dashboard">Loading dashboard...</div>;
  if (error) return <div className="admin-dashboard error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-cards">
        <div className="card">Total Users: {users.length}</div>
        <div className="card">Total Gigs: {gigs.length}</div>
        <div className="card">Total Orders: {orders.length}</div>
        <div className="card">Total Messages: {messages.length}</div>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Users Table */}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isBanned ? "Banned" : "Active"}</td>
              <td>
                {!user.isBanned && (
                  <button className="ban-btn" onClick={() => handleBan(user._id)}>
                    Ban
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
