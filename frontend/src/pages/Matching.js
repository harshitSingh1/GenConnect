import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Matching.css";

// Base options that will be extended with user data
const baseSkillsOptions = [
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

const baseInterestsOptions = [
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
  const [allUsers, setAllUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [filters, setFilters] = useState({
    profileType: null,
    skills: null,
    interests: null,
    searchQuery: "",
  });
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skillsOptions, setSkillsOptions] = useState(baseSkillsOptions);
  const [interestsOptions, setInterestsOptions] = useState(baseInterestsOptions);

  const API_BASE = process.env.REACT_APP_LOCAL_API_URL || "https://genconnect-server.vercel.app";

  // Extract unique skills and interests from all users
   const extractUniqueOptions = useCallback((users, field) => {
    const allItems = users.flatMap(user => 
      Array.isArray(user[field]) ? user[field] : []
    );
    
    const uniqueItems = [...new Set(allItems)]
      .filter(item => item && item.trim() !== "")
      .map(item => ({
        value: item.toLowerCase(),
        label: item
      }));
    
    return uniqueItems;
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/users`);
      const allUsersData = res.data.users;
      setAllUsers(allUsersData);
      
      const filteredUsers = loggedInUserId
        ? allUsersData.filter((user) => user._id !== loggedInUserId)
        : allUsersData;
      
      setUsers(filteredUsers);

      // Extract unique skills and interests from all users
      const uniqueSkills = extractUniqueOptions(allUsersData, 'skills');
      const uniqueInterests = extractUniqueOptions(allUsersData, 'interests');

      const combinedSkills = [...baseSkillsOptions, ...uniqueSkills].reduce((acc, current) => {
        const exists = acc.find(item => item.value === current.value);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      const combinedInterests = [...baseInterestsOptions, ...uniqueInterests].reduce((acc, current) => {
        const exists = acc.find(item => item.value === current.value);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      setSkillsOptions(combinedSkills);
      setInterestsOptions(combinedInterests);

    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users");
    }
  }, [loggedInUserId, API_BASE, extractUniqueOptions]);

  const fetchConnectionData = useCallback(async () => {
    if (!loggedInUserId) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [pendingRes, sentRes, connectionsRes] = await Promise.all([
        axios.get(`${API_BASE}/connections/pending-requests`, { headers }),
        axios.get(`${API_BASE}/connections/sent-requests`, { headers }),
        axios.get(`${API_BASE}/connections/connections`, { headers })
      ]);

      if (pendingRes.data.success) setPendingRequests(pendingRes.data.requests);
      if (sentRes.data.success) setSentRequests(sentRes.data.requests);
      if (connectionsRes.data.success) setConnections(connectionsRes.data.connections);
    } catch (error) {
      console.error("Error fetching connection data:", error);
    }
  }, [loggedInUserId, API_BASE]);

  const fetchLoggedInUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found. User is not logged in.");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedInUserId(res.data.user._id);
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
  }, [API_BASE]);

 useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchLoggedInUser();
      await fetchUsers();
      setLoading(false);
    };
    initializeData();
  }, [fetchLoggedInUser, fetchUsers]);

  useEffect(() => {
    if (loggedInUserId) {
      fetchConnectionData();
    }
  }, [loggedInUserId, fetchConnectionData]);
  // Apply filters locally for better performance and flexibility
    const applyFilters = useCallback(() => {
    let filteredUsers = allUsers.filter(user => user._id !== loggedInUserId);

    // Profile type filter
    if (filters.profileType && filters.profileType.value !== "all") {
      filteredUsers = filteredUsers.filter(user => 
        user.profileType === filters.profileType.value
      );
    }

    // Skills filter (case-insensitive partial match)
    if (filters.skills) {
      const searchSkill = filters.skills.value.toLowerCase();
      filteredUsers = filteredUsers.filter(user => {
        const userSkills = Array.isArray(user.skills) ? user.skills : [];
        return userSkills.some(skill => 
          skill && skill.toLowerCase().includes(searchSkill)
        );
      });
    }

 if (filters.interests) {
      const searchInterest = filters.interests.value.toLowerCase();
      filteredUsers = filteredUsers.filter(user => {
        const userInterests = Array.isArray(user.interests) ? user.interests : [];
        return userInterests.some(interest => 
          interest && interest.toLowerCase().includes(searchInterest)
        );
      });
    }

    // Search query filter (case-insensitive search across multiple fields)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(query) ||
        (Array.isArray(user.skills) && user.skills.some(skill => 
          skill && skill.toLowerCase().includes(query))) ||
        (Array.isArray(user.interests) && user.interests.some(interest => 
          interest && interest.toLowerCase().includes(query))) ||
        user.profileType.toLowerCase().includes(query)
      );
    }

    setUsers(filteredUsers);
  }, [filters, allUsers, loggedInUserId]);

    useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleConnect = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE}/connections/send-request`, 
        { toUserId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Connection request sent!");
        fetchConnectionData();
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error sending connection request");
      }
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE}/connections/accept-request/${requestId}`, 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Connection request accepted!");
        fetchConnectionData();
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Error accepting connection request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE}/connections/reject-request/${requestId}`, 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Connection request rejected");
        fetchConnectionData();
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Error rejecting connection request");
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE}/connections/cancel-request/${requestId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Connection request cancelled");
        fetchConnectionData();
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("Error cancelling connection request");
    }
  };

  const getConnectionStatus = (userId) => {
    const isConnected = connections.some(conn => conn.user._id === userId);
    if (isConnected) return "connected";

    const isRequestSent = sentRequests.some(request => request.toUser._id === userId);
    if (isRequestSent) return "pending";

    const hasPendingRequest = pendingRequests.some(request => request.fromUser._id === userId);
    if (hasPendingRequest) return "request_received";

    return "not_connected";
  };

  const clearFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: null
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      profileType: null,
      skills: null,
      interests: null,
      searchQuery: "",
    });
  };

  const renderUserCard = (user) => {
    const connectionStatus = getConnectionStatus(user._id);
    
    return (
      <motion.div
        key={user._id}
        className="user-card"
        whileHover={{ scale: 1.05 }}
      >
        <img src={user.profilePic} alt={user.name} className="user-avatar" />
        <h3>{user.name}</h3>
        <p className="profile-type">
          <b>({user.profileType})</b>
        </p>
        <p className="user-skills">
          <b>Skills:</b> {Array.isArray(user.skills) ? user.skills.join(", ") : user.skills}
        </p>
        <p className="user-interests">
          <b>Interests:</b> {Array.isArray(user.interests) ? user.interests.join(", ") : user.interests}
        </p>
        
        {connectionStatus === "connected" && (
          <button className="status-btn connected" disabled>
            Connected
          </button>
        )}
        {connectionStatus === "pending" && (
          <button className="status-btn pending" disabled>
            Pending
          </button>
        )}
        {connectionStatus === "request_received" && (
          <div className="request-actions">
            <button 
              className="action-btn accept"
              onClick={() => handleAcceptRequest(
                pendingRequests.find(r => r.fromUser._id === user._id)._id
              )}
            >
              Accept
            </button>
            <button 
              className="action-btn reject"
              onClick={() => handleRejectRequest(
                pendingRequests.find(r => r.fromUser._id === user._id)._id
              )}
            >
              Reject
            </button>
          </div>
        )}
        {connectionStatus === "not_connected" && (
          <button 
            className="connect-btn"
            onClick={() => handleConnect(user._id)}
          >
            Connect
          </button>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="matching-container">
        <div className="loading-spinner">...</div>
      </div>
    );
  }

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

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "discover" ? "active" : ""}`}
            onClick={() => setActiveTab("discover")}
          >
            Discover Users
          </button>
          <button 
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          <button 
            className={`tab ${activeTab === "sent" ? "active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            Sent Requests ({sentRequests.length})
          </button>
          <button 
            className={`tab ${activeTab === "connections" ? "active" : ""}`}
            onClick={() => setActiveTab("connections")}
          >
            Connections ({connections.length})
          </button>
        </div>
      </div>

      {/* Filters (only for discover tab) */}
      {activeTab === "discover" && (
        <div className="filters">
          <div className="filters-header">
            <h2>Refine Your Search</h2>
            {(filters.profileType || filters.skills || filters.interests || filters.searchQuery) && (
              <button className="clear-all-btn" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            )}
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <Select
                options={profileTypeOptions}
                placeholder="Profile Type"
                value={filters.profileType}
                onChange={(selected) => setFilters({ ...filters, profileType: selected })}
                className="filter-select"
                isClearable
              />
              {filters.profileType && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('profileType')}
                  title="Clear filter"
                >
                  ×
                </button>
              )}
            </div>

            <div className="filter-group">
              <Select
                options={skillsOptions}
                placeholder="Skills"
                value={filters.skills}
                onChange={(selected) => setFilters({ ...filters, skills: selected })}
                className="filter-select"
                isClearable
              />
              {filters.skills && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('skills')}
                  title="Clear filter"
                >
                  ×
                </button>
              )}
            </div>

            <div className="filter-group">
              <Select
                options={interestsOptions}
                placeholder="Interests"
                value={filters.interests}
                onChange={(selected) => setFilters({ ...filters, interests: selected })}
                className="filter-select"
                isClearable
              />
              {filters.interests && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('interests')}
                  title="Clear filter"
                >
                  ×
                </button>
              )}
            </div>

            <div className="filter-group">
              <input
                type="text"
                placeholder="Search by Name, Skills, or Interests"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="search-input"
              />
              {filters.searchQuery && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => setFilters({ ...filters, searchQuery: "" })}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Active filters display */}
          {(filters.profileType || filters.skills || filters.interests || filters.searchQuery) && (
            <div className="active-filters">
              <span>Active filters: </span>
              {filters.profileType && (
                <span className="filter-tag">
                  Profile: {filters.profileType.label}
                  <button onClick={() => clearFilter('profileType')}>×</button>
                </span>
              )}
              {filters.skills && (
                <span className="filter-tag">
                  Skill: {filters.skills.label}
                  <button onClick={() => clearFilter('skills')}>×</button>
                </span>
              )}
              {filters.interests && (
                <span className="filter-tag">
                  Interest: {filters.interests.label}
                  <button onClick={() => clearFilter('interests')}>×</button>
                </span>
              )}
              {filters.searchQuery && (
                <span className="filter-tag">
                  Search: "{filters.searchQuery}"
                  <button onClick={() => setFilters({ ...filters, searchQuery: "" })}>×</button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content based on active tab */}
      <div className="content-section">
        {activeTab === "discover" && (
          <div className="user-grid">
            {users.length > 0 ? (
              users.map(renderUserCard)
            ) : (
              <p className="no-users">
                {Object.values(filters).some(filter => filter !== null && filter !== "") 
                  ? "No users match your filters. Try adjusting your search criteria."
                  : "No users found"
                }
              </p>
            )}
          </div>
        )}

        {/* Other tabs remain the same */}
        {activeTab === "pending" && (
          <div className="requests-grid">
            {pendingRequests.length > 0 ? (
              pendingRequests.map(request => (
                <motion.div
                  key={request._id}
                  className="request-card"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={request.fromUser.profilePic} alt={request.fromUser.name} className="user-avatar" />
                  <h3>{request.fromUser.name}</h3>
                  <p className="profile-type">
                    <b>({request.fromUser.profileType})</b>
                  </p>
                  <p className="user-skills">
                    <b>Skills:</b> {Array.isArray(request.fromUser.skills) ? request.fromUser.skills.join(", ") : request.fromUser.skills}
                  </p>
                  <p className="user-interests">
                    <b>Interests:</b> {Array.isArray(request.fromUser.interests) ? request.fromUser.interests.join(", ") : request.fromUser.interests}
                  </p>
                  {request.message && (
                    <p className="request-message">
                      <b>Message:</b> {request.message}
                    </p>
                  )}
                  <div className="request-actions">
                    <button 
                      className="action-btn accept"
                      onClick={() => handleAcceptRequest(request._id)}
                    >
                      Accept
                    </button>
                    <button 
                      className="action-btn reject"
                      onClick={() => handleRejectRequest(request._id)}
                    >
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="no-requests">No pending requests</p>
            )}
          </div>
        )}

        {activeTab === "sent" && (
          <div className="requests-grid">
            {sentRequests.length > 0 ? (
              sentRequests.map(request => (
                <motion.div
                  key={request._id}
                  className="request-card"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={request.toUser.profilePic} alt={request.toUser.name} className="user-avatar" />
                  <h3>{request.toUser.name}</h3>
                  <p className="profile-type">
                    <b>({request.toUser.profileType})</b>
                  </p>
                  <p className="user-skills">
                    <b>Skills:</b> {Array.isArray(request.toUser.skills) ? request.toUser.skills.join(", ") : request.toUser.skills}
                  </p>
                  <p className="user-interests">
                    <b>Interests:</b> {Array.isArray(request.toUser.interests) ? request.toUser.interests.join(", ") : request.toUser.interests}
                  </p>
                  <button 
                    className="action-btn cancel"
                    onClick={() => handleCancelRequest(request._id)}
                  >
                    Cancel Request
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="no-requests">No sent requests</p>
            )}
          </div>
        )}

        {activeTab === "connections" && (
          <div className="connections-grid">
            {connections.length > 0 ? (
              connections.map(connection => (
                <motion.div
                  key={connection._id}
                  className="connection-card"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={connection.user.profilePic} alt={connection.user.name} className="user-avatar" />
                  <h3>{connection.user.name}</h3>
                  <p className="profile-type">
                    <b>({connection.user.profileType})</b>
                  </p>
                  <p className="user-skills">
                    <b>Skills:</b> {Array.isArray(connection.user.skills) ? connection.user.skills.join(", ") : connection.user.skills}
                  </p>
                  <p className="user-interests">
                    <b>Interests:</b> {Array.isArray(connection.user.interests) ? connection.user.interests.join(", ") : connection.user.interests}
                  </p>
                  <p className="connected-since">
                    Connected since: {new Date(connection.connectedAt).toLocaleDateString()}
                  </p>
                  <button className="status-btn connected" disabled>
                    Connected
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="no-connections">No connections yet</p>
            )}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Matching;