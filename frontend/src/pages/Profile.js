import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { getApiUrl } from '../utils/api';
import "../styles/Profile.css";

function Profile({ setIsAuthenticated }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileType: "Teen",
    interests: "",
    skills: "",
    dateOfBirth: "",
    profilePic: "",
    sessionPreferences: {
      virtual: true,
      inPerson: false
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Please log in first");
        navigate("/login");
        return;
      }

      const url = `${getApiUrl()}/auth/profile`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // If unauthorized, clear storage and redirect to login
        if (response.status === 401) {
          clearAuthData();
          navigate("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setUserData(result.user);
        // Prepopulate form data
        setFormData({
          name: result.user.name || "",
          email: result.user.email || "",
          profileType: result.user.profileType || "Teen",
          interests: Array.isArray(result.user.interests) ? result.user.interests.join(", ") : "",
          skills: Array.isArray(result.user.skills) ? result.user.skills.join(", ") : "",
          dateOfBirth: result.user.dateOfBirth ? new Date(result.user.dateOfBirth).toISOString().split('T')[0] : "",
          profilePic: result.user.profilePic || "",
          sessionPreferences: result.user.sessionPreferences || {
            virtual: true,
            inPerson: false
          }
        });
      } else {
        handleError(result.message || "Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      handleError("Error loading profile data");
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("profileType");
    
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    handleSuccess("Logged out successfully!");
    
    // Use a small timeout to ensure the toast message is visible
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith("sessionPreferences.")) {
      const prefKey = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        sessionPreferences: {
          ...prev.sessionPreferences,
          [prefKey]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Please log in again");
        handleLogout();
        return;
      }

      const url = `${getApiUrl()}/auth/update-profile`;

      const updateData = {
        name: formData.name,
        profileType: formData.profileType,
        interests: formData.interests.split(',').map(item => item.trim()).filter(item => item !== ''),
        skills: formData.skills.split(',').map(item => item.trim()).filter(item => item !== ''),
        dateOfBirth: formData.dateOfBirth,
        profilePic: formData.profilePic,
        sessionPreferences: formData.sessionPreferences
      };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      // Check if unauthorized
      if (response.status === 401) {
        handleError("Session expired. Please log in again.");
        handleLogout();
        return;
      }

      const result = await response.json();

      if (result.success) {
        handleSuccess("Profile updated successfully!");
        setUserData(result.user);
        setEditing(false);
        // Refresh the data
        fetchUserData();
      } else {
        handleError(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      handleError("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to current user data
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        profileType: userData.profileType || "Teen",
        interests: Array.isArray(userData.interests) ? userData.interests.join(", ") : "",
        skills: Array.isArray(userData.skills) ? userData.skills.join(", ") : "",
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : "",
        profilePic: userData.profilePic || "",
        sessionPreferences: userData.sessionPreferences || {
          virtual: true,
          inPerson: false
        }
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <h2>Loading Profile...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Error Loading Profile</h2>
          <p>Unable to load your profile data. Please try again.</p>
          <button onClick={fetchUserData} className="retry-button">
            Retry
          </button>
          <button onClick={() => navigate("/login")} className="login-button">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <img 
              src={userData.profilePic || "https://placehold.co/150x150"} 
              alt="Profile" 
              className="avatar-image"
            />
            {editing && (
              <div className="avatar-edit">
                <input
                  type="text"
                  name="profilePic"
                  value={formData.profilePic}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  className="avatar-url-input"
                />
              </div>
            )}
          </div>

          {!editing ? (
            // View Mode
            <div className="profile-info">
              <div className="info-section">
                <h3>Personal Information</h3>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{userData.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{userData.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Profile Type:</span>
                  <span className="info-value">{userData.profileType}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date of Birth:</span>
                  <span className="info-value">
                    {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : "Not set"}
                  </span>
                </div>
              </div>

              <div className="info-section">
                <h3>Interests & Skills</h3>
                <div className="info-row">
                  <span className="info-label">Interests:</span>
                  <span className="info-value">{userData.interests?.join(", ") || "None specified"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Skills:</span>
                  <span className="info-value">{userData.skills?.join(", ") || "None specified"}</span>
                </div>
              </div>

              <div className="info-section">
                <h3>Session Preferences</h3>
                <div className="info-row">
                  <span className="info-label">Virtual Sessions:</span>
                  <span className="info-value">{userData.sessionPreferences?.virtual ? "Yes" : "No"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">In-Person Sessions:</span>
                  <span className="info-value">{userData.sessionPreferences?.inPerson ? "Yes" : "No"}</span>
                </div>
              </div>

              <div className="info-section">
                <h3>Stats & Achievements</h3>
                <div className="info-row">
                  <span className="info-label">Points:</span>
                  <span className="info-value">{userData.points || 0}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Rating:</span>
                  <span className="info-value">{userData.rating || "No ratings yet"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Reviews:</span>
                  <span className="info-value">{userData.reviewCount || 0}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Badges:</span>
                  <span className="info-value">{userData.badges?.length || 0} earned</span>
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  onClick={() => setEditing(true)} 
                  className="edit-profile-btn"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="input-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled // Email shouldn't be editable for security
                  />
                  <small>Email cannot be changed for security reasons</small>
                </div>

                <div className="input-group">
                  <label>Profile Type *</label>
                  <select
                    name="profileType"
                    value={formData.profileType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Teen">Teen (Seeking Guidance)</option>
                    <option value="Senior">Senior (Offering Wisdom)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Interests & Skills</h3>
                <div className="input-group">
                  <label>Interests (comma separated)</label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    placeholder="e.g., Gardening, Cooking, Technology"
                  />
                </div>

                <div className="input-group">
                  <label>Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., Teaching, Coding, Storytelling"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Session Preferences</h3>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="sessionPreferences.virtual"
                      checked={formData.sessionPreferences.virtual}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Virtual Sessions
                  </label>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="sessionPreferences.inPerson"
                      checked={formData.sessionPreferences.inPerson}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    In-Person Sessions
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Profile;