import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("https://genconnect-server.vercel.app/auth/profile", {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.user) {
            setIsLoggedIn(true);
            setProfilePic(
              data.user.profilePic && data.user.profilePic.trim() !== ""
                ? data.user.profilePic
                : "https://placehold.co/40x40"
            );
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem("token"); // Remove invalid token
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          setIsLoggedIn(false);
          localStorage.removeItem("token"); // Handle fetch errors by logging out
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Function to handle smooth scrolling
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    
    if (!section) {
      window.location.href = `/home#${sectionId}`;
    } else {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };
  
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    const path = location.pathname.replace("/", "");
    setActiveSection(path || "home");
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">GenConnect</Link>
        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          {["home", "matching", "options", "marketplace", "companionship", "forum", "gamification"].map((section) => (
            <button
              key={section}
              className={activeSection === section ? "active" : ""}
              onClick={() => handleScroll(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}

          {isLoggedIn ? (
            <Link to="/profile" className="profile-icon">
              <img src={profilePic || "https://placehold.co/40x40"} alt="Profile" className="profile-pic" />
            </Link>
          ) : (
            <div className="auth-buttons">
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </div>

        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</div>
      </div>
    </nav>
  );
}

export default Navbar;
