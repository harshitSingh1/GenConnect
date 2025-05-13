// frontend\src\pages\Matching.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Matching.css";

const skillsOptions = [
  { value: "gardening", label: "Gardening" },
  { value: "cooking", label: "Cooking" },
  { value: "technology", label: "Technology" },
  { value: "storytelling", label: "Storytelling" },
  { value: "music", label: "Music" },
  { value: "painting", label: "Painting" },
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "career-advice", label: "Career Advice" },
  { value: "sports", label: "Sports" },
];

const interestsOptions = [
    { value: "chess", label: "Chess" },
    { value: "coding", label: "Coding" },
    { value: "cooking", label: "Cooking" },
    { value: "cricket", label: "Cricket" },
    { value: "dancing", label: "Dancing" },
    { value: "drawing", label: "Drawing" },
    { value: "gaming", label: "Gaming" },
    { value: "meditation", label: "Meditation" },
    { value: "painting", label: "Painting" },
    { value: "photography", label: "Photography" },
    { value: "reading", label: "Reading" },
    { value: "robotics", label: "Robotics" },
    { value: "science", label: "Science" },
    { value: "travel", label: "Travel" },
    { value: "volunteering", label: "Volunteering" },
    { value: "writing", label: "Writing" },
    { value: "yoga", label: "Yoga" }
  ];
  

const profileTypeOptions = [
  { value: "all", label: "All Profiles" },
  { value: "Teen", label: "Teen" },
  { value: "Senior", label: "Senior" },
];

const Matching = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    profileType: null,
    skills: null,
    interests: null,
    searchQuery: "",
  });
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("https://genconnect-server.vercel.app/auth/users");
      const filteredUsers = loggedInUserId
        ? res.data.users.filter((user) => user._id !== loggedInUserId)
        : res.data.users;
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    fetchLoggedInUser();
    fetchUsers();
  }, [fetchUsers]);

  const fetchLoggedInUser = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.log("No token found. User is not logged in.");
      return;
    }

    try {
      const res = await axios.get("https://genconnect-server.vercel.app/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedInUserId(res.data.user._id);
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
  };

  const applyFilters = async () => {
    try {
      const res = await axios.get("https://genconnect-server.vercel.app/auth/users", {
        params: {
          profileType: filters.profileType?.value === "all" ? null : filters.profileType?.value,
          skills: filters.skills?.value,
          interests: filters.interests?.value,
          searchQuery: filters.searchQuery,
        },
      });

      const filteredUsers = loggedInUserId
        ? res.data.users.filter((user) => user._id !== loggedInUserId)
        : res.data.users;
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleConnect = () => {
    toast.success("Connected with user successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="matching-container">
      <div className="header">
        <div className="left-section">
          <h1 className="heading">Find Your Perfect Match</h1>
          <p className="subheading">
            Our AI-powered matching system connects users based on shared interests, skills, and availability.
          </p>
          <motion.button
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document
                .querySelector(".filters")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            &#11182; Connect With Users &#11183;
          </motion.button>
        </div>
        <div className="right-section">
          {[
            "https://storage.googleapis.com/a1aa/image/RQTTmYDkgQmODcE3agruNJEh4cHIZWiGsOZausjCpTY.jpg",
            "https://storage.googleapis.com/a1aa/image/Q39BeN3JJnDZ_yy463FDwxt2-PHHbPBhQ0WlFz5_qDI.jpg",
            "https://storage.googleapis.com/a1aa/image/h_rKQa4FEeUhWZIsLVeDl5Qg7hHP3GjBaGWUOvu7WAA.jpg",
            "https://storage.googleapis.com/a1aa/image/lElOVW2_EfIo4wZWOyR-7ejGaS4TmV0EyUSiZOzn5B8.jpg",
          ].map((src, index) => (
            <motion.div
              key={index}
              className="image-container"
              whileHover={{ scale: 1.1 }}
            >
              <img src={src} alt={`Match ${index + 1}`} className="match-image" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="filters">
        <h2>Refine Your Search</h2>
        <div className="filter-options">
          <Select
            options={profileTypeOptions}
            placeholder="Profile Type"
            onChange={(e) => setFilters({ ...filters, profileType: e })}
          />
          <Select
            options={skillsOptions}
            placeholder="Skills"
            onChange={(e) => setFilters({ ...filters, skills: e })}
          />
          <Select
            options={interestsOptions}
            placeholder="Interests"
            onChange={(e) => setFilters({ ...filters, interests: e })}
          />
          <input
            type="text"
            placeholder="Search by Name or Skill"
            onChange={(e) =>
              setFilters({ ...filters, searchQuery: e.target.value })
            }
          />
          <button className="refresh-btn" onClick={applyFilters}>
            Refresh
          </button>
        </div>
      </div>

      <div className="user-list">
        {users.length > 0 ? (
          users.map((user, index) => (
            <motion.div
              key={index}
              className="user-card"
              whileHover={{ scale: 1.05 }}
            >
              <img src={user.profilePic} alt={user.name} />
              <h3>{user.name}</h3>
              <p>
                <b>(</b> {user.profileType} <b>)</b>
              </p>
              <p>
                <b>Skills:</b> {user.skills}
              </p>
              <p>
                <b>Interests:</b> {user.interests}
              </p>
              <button className="connect-btn" onClick={handleConnect}>
                Connect
              </button>
            </motion.div>
          ))
        ) : (
          <p>No Users Found</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Matching;