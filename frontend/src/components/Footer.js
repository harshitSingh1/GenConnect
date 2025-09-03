import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import "../components/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="clouds">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
            </div>
            <div className="snowfall">
                {Array.from({ length: 100 }).map((_, index) => (
                    <div key={index} className="snowflake" style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random(),
                        fontSize: `${Math.random() * 20 + 20}px`,
                        color: `hsl(${Math.random() * 60 + 180}, 70%, ${Math.random() * 30 + 50}%)`,
                    }}>❄</div>
                ))}
            </div>

            <div className="footer-content">
                <div className="footer-column">
                    <div className="logo-slogan">
                        <img src="../assets/logo.png" alt="Website Logo" className="footer-logo" />
                        <p className="slogan">Bridging Generations, Building Connections.</p>
                    </div>
                    <div className="social-media">
                        <a href="/" className="social-icon facebook" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="/" className="social-icon twitter" aria-label="Twitter"><FaTwitter /></a>
                        <a href="/" className="social-icon linkedin" aria-label="LinkedIn"><FaLinkedinIn /></a>
                        <a href="/" className="social-icon instagram" aria-label="Instagram"><FaInstagram /></a>
                        <a href="/" className="social-icon youtube" aria-label="YouTube"><FaYoutube /></a>
                    </div>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Enter your email" className="newsletter-input" />
                        <button type="submit" className="newsletter-button">Subscribe</button>
                    </form>
                </div>

                <div className="footer-column">
                    <h3 className="column-title">Services & Features</h3>
                    <ul className="services-list">
                        <li>AI Matching</li>
                        <li>Sessions</li>
                        <li>Skill Exchange</li>
                        <li>Gamification</li>
                        <li>Community</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3 className="column-title">Company & Legal</h3>
                    <ul className="company-links">
                        <li><a href="/">About Us</a></li>
                        <li><a href="/">Contact Us</a></li>
                        <li><a href="/">Careers</a></li>
                        <li><a href="/">Terms of Service</a></li>
                        <li><a href="/">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 GenConnect. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;