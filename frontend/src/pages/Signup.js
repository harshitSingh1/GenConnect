import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "../styles/Signup.css";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    profileType: "Teen",
    interests: "",
    skills: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, profileType, interests, skills, password } = signupInfo;
    if (!name || !email || !password || !interests || !skills) {
      return handleError("All fields are required");
    }
    console.log(profileType);
    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="signup-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Glassmorphic Signup Card */}
      <div className="signup-card">
        <h1>Create Your Account</h1>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Enter your name..."
              value={signupInfo.name}
            />
            <span className="input-icon">👤</span>
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
            />
            <span className="input-icon">✉️</span>
          </div>
          <div className="input-group">
            <label htmlFor="profileType">Profile Type</label>
            <select
              onChange={handleChange}
              name="profileType"
              value={signupInfo.profileType}
            >
              <option value="Teen">Teen</option>
              <option value="Senior">Senior</option>
            </select>
            <span className="input-icon">🧑‍🤝‍🧑</span>
          </div>
          <div className="input-group">
            <label htmlFor="interests">Interests</label>
            <input
              onChange={handleChange}
              type="text"
              name="interests"
              placeholder="Enter your interests..."
              value={signupInfo.interests}
            />
            <span className="input-icon">🎯</span>
          </div>
          <div className="input-group">
            <label htmlFor="skills">Skills</label>
            <input
              onChange={handleChange}
              type="text"
              name="skills"
              placeholder="Enter your skills..."
              value={signupInfo.skills}
            />
            <span className="input-icon">🛠️</span>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={signupInfo.password}
            />
            <span className="input-icon">🔒</span>
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div className="links">
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Signup;