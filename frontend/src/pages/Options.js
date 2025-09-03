import React from "react";
import "../styles/Options.css";
import { FaVideo, FaUsers, FaShieldAlt, FaUserCheck, FaLock, FaPhoneAlt } from "react-icons/fa";

function Options() {
  return (
    <section className="options-section">
      <div className="options-container">
        <h2 className="options-heading">🔹 Virtual & In-Person Options 🔹</h2>

        <div className="options-grid">
          <div className="option-card">
          <h3 className="option-title"><FaVideo /> Virtual Meetings</h3>
            <p className="option-description">
              Connect via video calls or chat from the comfort of your home.
            </p>
            <div className="wave-container">
              <img
                src="https://storage.googleapis.com/a1aa/image/R059Qvq8PWLLQKK7CdzQrVzs_NRZV7J2Ds59dMzOxR8.jpg"
                alt="Virtual Meeting"
                className="option-image"
              />
            </div>
            <ul className="option-features">
              <li>🔒 Secure video calls</li>
              <li>💬 Real-time chat</li>
              <li>📅 Flexible scheduling</li>
            </ul>
            <button className="option-button">📅 Book a Virtual Meeting</button>
          </div>

          <div className="option-card">
          <h3 className="option-title"><FaUsers /> In-Person Meetups</h3>
            <p className="option-description">
              Meet in person for a more personal connection.
            </p>
            <div className="wave-container">
              <img
                src="https://storage.googleapis.com/a1aa/image/25Y2MoNCvkEhmV8Oxyprh5w3Qa7endwYM2XASyRVC_E.jpg"
                alt="In-Person Meetup"
                className="option-image"
              />
            </div>
            <ul className="option-features">
              <li>📍 Location-based matching</li>
              <li>👥 Verified profiles</li>
              <li>🛡️ Safety guidelines</li>
            </ul>
            <button className="option-button">📍 Find Nearby Meetups</button>
          </div>
        </div>

        <div className="safety-section">
          <h3 className="safety-heading"><FaShieldAlt /> Safety Features</h3>
          <p className="safety-description">
            We prioritize your safety with the following measures:
          </p>
          <ul className="safety-features">
            <li><FaUserCheck /> Verified profiles for all users</li>
            <li><FaLock /> End-to-end encryption for virtual meetings</li>
            <li><FaPhoneAlt /> Emergency contact integration</li>
            <li>👨‍👩‍👧‍👦 Parental/guardian consent for teens</li>
          </ul>
        </div>
      </div>
      <div className="diamond-shape"></div>
    </section>
  );
}

export default Options;
