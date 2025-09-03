import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Marketplace.css";

function Marketplace() {
  const [listings, setListings] = useState([
    {
      id: 1,
      name: "Ramesh Iyer",
      profileType: "Senior",
      skill: "Knitting",
      description: "Learn the art of knitting and create beautiful patterns.",
      icon: "🧶",
    },
    {
      id: 2,
      name: "Neha Choudhary",
      profileType: "Teen",
      skill: "Tech Help",
      description: "Get help with setting up your smartphone or laptop.",
      icon: "💻",
    },
    {
      id: 3,
      name: "Sunita Rao",
      profileType: "Senior",
      skill: "Storytelling",
      description: "Listen to fascinating stories from Indian folklore.",
      icon: "📖",
    },
    {
      id: 4,
      name: "Aarav Singh",
      profileType: "Teen",
      skill: "Companionship",
      description: "Spend time chatting and sharing experiences.",
      icon: "👥",
    },
    {
      id: 5,
      name: "Vikram Mehta",
      profileType: "Senior",
      skill: "Chess Coaching",
      description: "Improve your chess skills with strategic guidance.",
      icon: "♟️",
    },
    {
      id: 6,
      name: "Pooja Verma",
      profileType: "Teen",
      skill: "Photography",
      description: "Learn basic photography skills and capture stunning shots.",
      icon: "📷",
    },
    {
      id: 7,
      name: "Suresh Patel",
      profileType: "Senior",
      skill: "Gardening",
      description: "Get tips on growing your own fruits and vegetables.",
      icon: "🌱",
    },
    {
      id: 8,
      name: "Ananya Sharma",
      profileType: "Teen",
      skill: "Language Learning",
      description: "Practice and improve your English or Hindi conversation skills.",
      icon: "🗣️",
    },
    {
      id: 9,
      name: "Manoj Tiwari",
      profileType: "Senior",
      skill: "Yoga & Meditation",
      description: "Join guided meditation and yoga sessions for relaxation.",
      icon: "🧘‍♂️",
    },
    {
      id: 10,
      name: "Kabir Das",
      profileType: "Teen",
      skill: "Music Lessons",
      description: "Learn to play the guitar or keyboard from scratch.",
      icon: "🎸",
    }
  ]);
  

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newListing, setNewListing] = useState({
    icon: "",
    skill: "",
    name: "",
    profileType: "",
    description: "",
  });

  const filteredListings = listings.filter((listing) =>
    listing.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !newListing.icon ||
      !newListing.skill ||
      !newListing.name ||
      !newListing.profileType ||
      !newListing.description
    ) {
      toast.error("Please fill all fields.");
      return;
    }
    setListings([...listings, { ...newListing, id: listings.length + 1 }]);
    setNewListing({
      icon: "",
      skill: "",
      name: "",
      profileType: "",
      description: "",
    });
    setShowForm(false);    
  };

  const handleRequestSession = () => {
    toast.success("Request sent successfully!");
  };

  useEffect(() => {
    const cards = document.querySelectorAll(".skill-card");
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }, [filteredListings]);

  return (
    <div className="marketplace-container">
      <h1 className="main-heading">Skill Exchange Marketplace</h1>
      <p className="subheading">Connect with others to share skills and learn something new!</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search skills or requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button>🔍</button>
      </div>

      <div className="listings-grid">
        <div className="add-listing-card" onClick={() => setShowForm(true)}>
          <div className="add-icon">+</div>
          <p>Add New Listing</p>
        </div>

        {filteredListings.map((listing) => (
          <div key={listing.id} className="skill-card">
            <div className="skill-icon">{listing.icon}</div>
            <h3>{listing.skill}</h3>
            <p className="profile-info">
              {listing.name} ({listing.profileType})
            </p>
            <p className="description">{listing.description}</p>
            <button className="request-button" onClick={handleRequestSession}>
              Request Session
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="add-listing-form">
            <h2>Add New Listing</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Icon</label>
                <input
                  type="text"
                  value={newListing.icon}
                  onChange={(e) =>
                    setNewListing({ ...newListing, icon: e.target.value })
                  }
                  placeholder="Enter an emoji ie. 🌍🚀🍜"
                  required
                />
              </div>
              <div className="form-group">
                <label>Skill/Request</label>
                <input
                  type="text"
                  value={newListing.skill}
                  onChange={(e) =>
                    setNewListing({ ...newListing, skill: e.target.value })
                  }
                  placeholder="Enter skill or request"
                  required
                />
              </div>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={newListing.name}
                  onChange={(e) =>
                    setNewListing({ ...newListing, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Profile Type</label>
                <select
                  value={newListing.profileType}
                  onChange={(e) =>
                    setNewListing({ ...newListing, profileType: e.target.value })
                  }
                  required
                >
                  <option value="">Select</option>
                  <option value="Teen">Teen</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newListing.description}
                  onChange={(e) =>
                    setNewListing({ ...newListing, description: e.target.value })
                  }
                  placeholder="Describe the skill or request"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Add Listing
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer autoClose={3000} />
    </div>
  );
}

export default Marketplace;