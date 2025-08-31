import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await newRequest.post("/auth/login", { username, password });

      // Backend sends banned users as 403
      if (res.status === 403) {
        setError("You have been banned by admin");
        setIsLoading(false);
        return;
      }

      // Save only safe fields in localStorage
      const safeUser = {
        _id: res.data._id,
        username: res.data.username,
        role: res.data.role,
        isSeller: res.data.isSeller,
        img: res.data.img || null,
      };
      localStorage.setItem("currentUser", JSON.stringify(safeUser));

      // Redirect based on role
      if (safeUser.role === "admin") {
        navigate("/admin"); // Admin dashboard
      } else {
        navigate("/"); // Regular user
      }
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      if (backendMessage) {
        setError(backendMessage);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
