import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import studentsGroup from "../images/students-group.png";
import img1 from "../images/students.jpg"; // Only keeping this image in the About Us section

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
          {/* Only keeping one image here */}
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
    </div>
  );
}

export default Home;
