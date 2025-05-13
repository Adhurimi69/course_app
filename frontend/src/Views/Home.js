import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import studentsGroup from "../images/students-group.png";
import img1 from "../images/students.jpg";
import socialTwitter from "../images/twitter.png";
import socialFacebook from "../images/facebook.png";
import socialInstagram from "../images/instagram.png";
import socialLinkedIn from "../images/linkedin.png";
import { Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const [showAlert, setShowAlert] = useState(true);

  const handleCreateAccount = () => {
    navigate("/app");
  };

  const scrollToCategories = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
      };

  return (
    <div className="home-wrapper">
      {/* ✅ Dismissible Alert */}
      {showAlert && (
        <div className="cta-alert">
          <span>🎉 Sign up now and get 25% off your first course!</span>
          <button className="close-alert" onClick={() => setShowAlert(false)}>✖</button>
        </div>
      )}

      <nav className="navbar">
        <div className="logo">🧠 edunity</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About Us</li>
          <li>Courses</li>
          <li>Pages</li>
          <li><Link to="/blog">Blog</Link></li>
          <li>Contact</li>
        </ul>
        <button className="create-account" onClick={handleCreateAccount}>
          Create Account
        </button>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h4>WELCOME EDUNITY ONLINE COURSES</h4>
          <h1>Achieving Your Dreams Through Education</h1>
          <p>
            We are specialized in educational platforms and skilled strategies
            for the success of online learners.
          </p>
          <button className="find-course" onClick={scrollToCategories}>
            Find Courses
          </button>
        </div>
        <img src={studentsGroup} alt="Students Group" />
      </section>

      <section className="categories" ref={categoriesRef}>
        <h2>Browse By Categories</h2>
        <div className="category-grid">
          {[
            "Business Management",
            "Arts & Design",
            "Personal Development",
            "UI/UX Design",
            "Graphic Design",
            "Digital Marketing",
            "Exclusive man",
            "Product Design",
            "Video & Photography",
          ].map((cat, i) => (
            <div className="category-card" key={i}>
              {cat}
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-images">
          <img src={img1} alt="Teacher" className="about-img" />
          <div className="experience-circle">8+<br />Years Of<br />Experiences</div>
        </div>
        <div className="about-text">
          <span className="about-label">OUR ABOUT US</span>
          <h2>
            Learn & Grow Your <span className="circle-highlight">Skills</span> From Anywhere
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="about-features">
            <div>
              <h4>FLEXIBLE CLASSNAMEES</h4>
              <p>Ultrice gravida dictum fusce placerat ultrices integer quis auctor elit.</p>
            </div>
            <div>
              <h4>FLEXIBLE CLASSNAMEES</h4>
              <p>Ultrice gravida dictum fusce placerat ultrices integer quis auctor elit.</p>
            </div>
          </div>
          <button className="load-more">Load More →</button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-bg" />
        <div className="footer-content">
          <a href="/" className="logo-link">{/* Optional logo */}</a>
          <p className="intro">
            We are a leading educational platform providing resources for students to succeed. Our mission is to make learning accessible to everyone.
          </p>
          <div className="social">
            <a href="#" className="icon">
              <img src={socialFacebook} alt="Facebook" />
            </a>
            <a href="#" className="icon">
              <img src={socialTwitter} alt="Twitter" />
            </a>
            <a href="#" className="icon">
              <img src={socialInstagram} alt="Instagram" />
            </a>
            <a href="#" className="icon">
              <img src={socialLinkedIn} alt="LinkedIn" />
            </a>
          </div>

          <div className="footer-column services">
            <h4>Our Services</h4>
            <ul>
              <li>Web Development</li>
              <li>UI/UX Design</li>
              <li>Management</li>
              <li>Digital Marketing</li>
              <li>Blog News</li>
            </ul>
          </div>

          <div className="footer-column quick-links">
            <h4>Contact Us</h4>
            <ul>
              <li>📍 225, Atirumadb, Mexico - USA</li>
              <li>📞 (001) 875-734-5261</li>
              <li>📧 peaceprince01@gmail.com</li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="gallery">
            {/* Optional gallery thumbnails */}
          </div>
        </div>
        <div className="bottom-bar">
          <span>© 2025</span>
          <span className="brand">edunity</span>
          <span>All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
