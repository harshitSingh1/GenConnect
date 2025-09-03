import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import "../styles/Login.css";

function Login({ setIsAuthenticated }) {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    
    if (!email || !password) {
      return handleError("Email and password are required");
    }
    
    setIsLoading(true);
    
    try {
      const url = `${process.env.REACT_APP_LOCAL_API_URL || "https://genconnect-server.vercel.app"}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      
      const result = await response.json();
      
      if (result.success) {
        handleSuccess(result.message);
        localStorage.setItem("token", result.jwtToken);
        localStorage.setItem("userEmail", result.email);
        localStorage.setItem("userName", result.name);
        localStorage.setItem("profileType", result.profileType);
        
        if (setIsAuthenticated) {
          setIsAuthenticated(true);
        }
        
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        handleError(result.message || "Login failed");
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to GenConnect</h1>
          <p>Bridging generations through shared experiences</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={loginInfo.email}
              required
            />
            <span className="input-icon">✉️</span>
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={loginInfo.password}
              required
            />
            <span className="input-icon">🔒</span>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          <p className="demo-credentials">
            Demo: teen@example.com / senior@example.com (password: demo123)
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;