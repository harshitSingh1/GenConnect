// frontend\src\pages\Home.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Bridging Generations</h1>
          <p>
            Connecting teenagers with senior citizens for mentorship, skill-sharing, and companionship.
          </p>
          <div className="hero-buttons">
            <Link to="/signup?type=Teen" className="btn btn-teen">Join as Teen</Link>
            <Link to="/signup?type=Senior" className="btn btn-senior">Join as Senior</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
