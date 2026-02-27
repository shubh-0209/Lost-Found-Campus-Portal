import React, { useState } from "react";
import { Link } from "react-router-dom";
import ".././register.css"; 
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!passwordRegex.test(password)) {
  alert(
    "Password must be at least 8 characters long and include:\n" +
    "• 1 uppercase letter\n" +
    "• 1 lowercase letter\n" +
    "• 1 number\n" +
    "• 1 special character"
  );
  return;
}

try {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  });

  const data = await response.json();
  console.log(data);

  if (response.ok) {
    toast.success("Registered Successfully 🎉");

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

  } else {
    toast.error(data.message || "Registration failed");
  }

} catch (error) {
  console.error(error);
  toast.error("Server error. Please try again.");
}
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">
          Join the Campus Lost & Found Portal
        </p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Campus Email</label>
            <input 
              type="email" 
              placeholder="yourname@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group password-group">
  <label>Password</label>
  <div className="password-input">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Create a password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <span
      className="eye-icon"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</div>

<div className="form-group password-group">
  <label>Confirm Password</label>
  <div className="password-input">
    <input
      type={showConfirmPassword ? "text" : "password"}
      placeholder="Confirm your password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
    <span
      className="eye-icon"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</div>

          <button type="submit" className="auth-button">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;