import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { getApiUrl } from '../utils/api';
import "../styles/Signup.css";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    profileType: "Teen",
    interests: "",
    skills: "",
    dateOfBirth: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, profileType, interests, skills, dateOfBirth, password } = signupInfo;
    
    if (!name || !email || !password) {
      return handleError("Name, email and password are required");
    }
    
    setIsLoading(true);
    
    try {
      const url = `${getApiUrl()}/auth/signup`;
      
      console.log("Sending signup data:", {
        name,
        email,
        profileType,
        interests,
        skills,
        dateOfBirth,
        password: "***"
      });
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          profileType,
          interests,
          skills,
          dateOfBirth: dateOfBirth || undefined,
          password
        }),
      });
      
      const result = await response.json();
      
      console.log("Signup response:", result);
      
      if (result.success) {
        handleSuccess(result.message || "Signup successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        handleError(result.message || result.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      handleError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="signup-card">
        <div className="signup-header">
          <h1>Join GenConnect</h1>
          <p>Create your account to bridge generations</p>
        </div>
        
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="name">Full Name *</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Enter your full name..."
              value={signupInfo.name}
              required
            />
            <span className="input-icon">👤</span>
          </div>
          
          <div className="input-group">
            <label htmlFor="email">Email *</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
              required
            />
            <span className="input-icon">✉️</span>
          </div>
          
          <div className="input-group">
            <label htmlFor="profileType">I am a *</label>
            <select
              onChange={handleChange}
              name="profileType"
              value={signupInfo.profileType}
              required
            >
              <option value="Teen">Teen (Seeking Guidance)</option>
              <option value="Senior">Senior (Offering Wisdom)</option>
            </select>
            <span className="input-icon">🧑‍🤝‍🧑</span>
          </div>
          
          <div className="input-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              onChange={handleChange}
              type="date"
              name="dateOfBirth"
              value={signupInfo.dateOfBirth}
            />
            <span className="input-icon">📅</span>
          </div>
          
          <div className="input-group">
            <label htmlFor="interests">Interests (comma separated)</label>
            <input
              onChange={handleChange}
              type="text"
              name="interests"
              placeholder="e.g., Gardening, Cooking, Technology"
              value={signupInfo.interests}
            />
            <span className="input-icon">🎯</span>
          </div>
          
          <div className="input-group">
            <label htmlFor="skills">Skills (comma separated)</label>
            <input
              onChange={handleChange}
              type="text"
              name="skills"
              placeholder="e.g., Teaching, Coding, Storytelling"
              value={signupInfo.skills}
            />
            <span className="input-icon">🛠️</span>
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password *</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Create a password..."
              value={signupInfo.password}
              required
            />
            <span className="input-icon">🔒</span>
          </div>
          
          <button 
            type="submit" 
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Signup;