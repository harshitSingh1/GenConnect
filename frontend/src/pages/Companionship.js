import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import "../styles/Companionship.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Companionship() {
    const [points, setPoints] = useState(1200);

    const handleStartSession = () => {
        setPoints(points + 100);
        toast.success("Session started! You've earned 100 companionship points!");
    };

    return (
        <>
            <Navbar />
            <div className="companionship-container">

                <div className="hero">
                    <h1>🤝 Companionship Mode 🤝</h1>
                    <p>Spend time with seniors, listen to their stories, and earn rewards!</p>
                </div>

                <div className="info-section">
                    <h2>How It Works</h2>
                    <p>Join seniors for conversations and earn points that can be redeemed for exciting rewards!</p>
                </div>

                <div className="rewards-container">
                    <h2>🎁 Earn & Redeem</h2>
                    <div className="reward-grid">
                        <div className="reward-card">
                            <h3>🎟️ Gift Cards</h3>
                            <p>Redeem points for Amazon, Netflix, or Starbucks gift cards.</p>
                            <span>2000 pts</span>
                        </div>
                        <div className="reward-card">
                            <h3>🏆 Certificates</h3>
                            <p>Receive certificates for community service.</p>
                            <span>1500 pts</span>
                        </div>
                        <div className="reward-card">
                            <h3>🎮 Game Pass</h3>
                            <p>Get subscriptions for PlayStation, Xbox, or PC gaming.</p>
                            <span>2500 pts</span>
                        </div>
                    </div>
                </div>

                <div className="progress-section">
                    <h2>🏅 Your Progress</h2>
                    <p>You have <strong>{points}</strong> points</p>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(points / 2500) * 100}%` }}></div>
                    </div>
                </div>

                <button className="start-session-btn" onClick={handleStartSession}>
                    Start a Session & Earn Points
                </button>

                <ToastContainer position="bottom-right" autoClose={3000} />
            </div>
        </>
    );
}

export default Companionship;
