import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";


function Login() {

const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
    
      const data = await response.json();
      console.log(data);
    
      if (response.ok) {
        login(data.user, data.token); 
        localStorage.setItem("lastActivity", Date.now());
        toast.success("Login Successful 🎉");

        setTimeout(() => {
          navigate("/");
        }, 1500);
    
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">
          Login to access your lost & found dashboard
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Campus Email</label>
            <input 
              type="email" 
              placeholder="yourname@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;