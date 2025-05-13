import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import studentsGroup from "../images/students-group.png";
import img1 from "../images/students.jpg";

function Home() {
  const navigate = useNavigate();
  const categoriesRef = useRef(null);

  const handleCreateAccount = () => {
    navigate("/app");
  };

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-wrapper">
      <header className="top-bar">
        <div className="contact-info">
          📞 (001) 875-734-5261 | 📧 peaceprince01@gmail.com | 📍 225,
          Atirumadb, Mexico - USA
        </div>
        <div className="social-icons">🔵 🟡</div>
      </header>

      <nav className="navbar">
        <div className="logo">🧠 edunity</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About Us</li>
          <li>Courses</li>
          <li>Pages</li>
          <li>Blog</li>
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

      {/* Categories Section */}
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

      {/* About Section */}
      <section className="about-section">
        <div className="about-images">
          <img src={img1} alt="Teacher" className="about-img" />
          <div className="experience-circle">
            8+<br />Years Of<br />Experiences
          </div>
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

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>About Us</h3>
            <p>
              We are a leading educational platform providing resources for
              students to succeed. Our mission is to make learning accessible to
              everyone.
            </p>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Courses</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <ul>
              <li>Email: info@eduplatform.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Education St, City, Country</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Follow Us</h3>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Footer Bottom Section */}
      <div className="footer-bottom">
        <p>&copy; 2025 Edunity. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Home;
