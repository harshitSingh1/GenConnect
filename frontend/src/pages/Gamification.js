import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Gamification.css";

function Gamification() {
  const badges = [
    {
      id: 1,
      name: "Master Gardener",
      description: "Awarded to seniors who teach gardening skills.",
      image:
        "https://static.vecteezy.com/system/resources/previews/043/211/800/large_2x/a-shield-featuring-intricate-leaves-and-a-cross-design-symbolizing-strength-and-protection-health-care-logo-design-template-free-vector.jpg",
    },
    {
      id: 2,
      name: "Tech Whiz",
      description: "Awarded to teens who help seniors with technology.",
      image:
        "https://static.vecteezy.com/system/resources/previews/043/212/685/non_2x/stylized-logo-of-a-ship-with-a-star-in-the-center-designed-for-a-tech-startup-clean-and-minimalistic-logo-for-a-tech-startup-with-subtle-digital-inspired-elements-free-vector.jpg",
    },
    {
      id: 3,
      name: "Community Hero",
      description: "Awarded for active participation in community events.",
      image:
        "https://static.vecteezy.com/system/resources/previews/043/212/380/non_2x/the-logo-features-a-shield-symbolizing-protection-and-security-for-a-company-in-the-security-industry-abstract-representation-of-protection-and-security-minimalist-simple-modern-logo-design-free-vector.jpg",
    },
    {
      id: 4,
      name: "Skill Sharer",
      description: "Awarded for sharing skills with others.",
      image:
        "https://static.vecteezy.com/system/resources/previews/043/209/578/non_2x/a-shield-logo-featuring-wings-symbolizing-trust-and-reliability-a-minimalist-logo-that-conveys-trust-and-reliability-minimalist-simple-modern-logo-design-free-vector.jpg",
    },
    {
      id: 5,
      name: "Storyteller",
      description: "Awarded to seniors who share fascinating stories.",
      image: "https://static.vecteezy.com/system/resources/previews/043/212/688/large_2x/black-and-white-emblem-design-featuring-a-prominent-star-symbol-for-cutting-edge-software-and-technology-a-sleek-and-modern-emblem-for-a-cutting-edge-software-development-company-free-vector.jpg",
    },
    {
      id: 6,
      name: "Companion",
      description: "Awarded to teens who provide companionship.",
      image: "https://static.vecteezy.com/system/resources/previews/000/632/441/large_2x/vector-stars-logos-and-symbols.jpg",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="gamification-container">
        <h1>Gamification & Rewards</h1>
        <p>Earn badges and points for engaging in community activities and skill-sharing.</p>
        <div className="badges-grid">
          {badges.map((badge) => (
            <div key={badge.id} className="badge-card">
              <div className="badge-image">
                {badge.image ? (
                  <img src={badge.image} alt={badge.name} />
                ) : (
                  <div className="placeholder-icon">🏅</div>
                )}
              </div>
              <h3>{badge.name}</h3>
              <p>{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Gamification;