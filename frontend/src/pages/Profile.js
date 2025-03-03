// frontend\src\pages\Profile.js
import React, { useState, useEffect } from "react";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileType: "",
    interests: "",
    skills: "",
    profilePic: "",
  });
  const [message, setMessage] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const response = await fetch("http://localhost:8080/auth/profile", {
          headers: { Authorization: token },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setFormData(data.user);
          setProfilePic(data.user.profilePic && data.user.profilePic.trim() !== "" ? data.user.profilePic : "https://placehold.co/150x150");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
  
    fetchUser();
  }, []);
  

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user);
    setProfilePic(user.profilePic || "https://placehold.co/150x150");
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProfilePicChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.value });
    setProfilePic(e.target.value);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setUser(formData);
        setIsEditing(false);
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="profile-main-container">
      {message && <div className="popup-message">{message}</div>}

      <div className="profile-card">
        <div className="profile-pic-container">
        <img src={profilePic || "https://placehold.co/150x150"} alt="Profile" className="profile-pic" />

          {isEditing && (
            <>
              <label>Profile Picture URL:</label>
              <input
                type="text"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleProfilePicChange}
                placeholder="Enter image URL"
              />
            </>
          )}
        </div>

        <div className="profile-info">
          {isEditing ? (
            <>
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />

              <label>Email:</label>
              <input type="email" name="email" value={formData.email} disabled />

              <label>Profile Type:</label>
              <select name="profileType" value={formData.profileType} onChange={handleChange}>
                <option value="Teen">Teen</option>
                <option value="Senior">Senior</option>
              </select>

              <label>Interests:</label>
              <input type="text" name="interests" value={formData.interests} onChange={handleChange} />

              <label>Skills:</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} />

              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </>
          ) : (
            <>
              <h2>{user.name}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Profile Type:</strong> {user.profileType}</p>
              <p><strong>Interests:</strong> {user.interests}</p>
              <p><strong>Skills:</strong> {user.skills}</p>

              <button onClick={handleEdit} className="edit-btn">Edit</button>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
