import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = file ? await upload(file) : "";
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });

      // ✅ Show registration success toast
      toast.success("Registration Successful!");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="username"
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input name="password" type="password" onChange={handleChange} />
          <label>Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label>Country</label>
          <input
            name="country"
            type="text"
            placeholder="Bangladesh"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label>Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label>Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+880 1731707414"
            onChange={handleChange}
          />
          <label>Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>

      {/* ToastContainer to display notifications */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default Register;
