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
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                </svg>
              </span>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginInfo.email}
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </span>
              <input
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                required
              />
            </div>
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
            Demo: emma.johnson@example.com (password: 12345)
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;