import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import studentsGroup from "../images/students-group.png";
import img1 from "../images/students.jpg";
import socialTwitter from "../images/twitter.png";
import socialFacebook from "../images/facebook.png";
import socialInstagram from "../images/instagram.png";
import socialLinkedIn from "../images/linkedin.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();
  const categoriesRef = useRef(null);

  const scrollToCategories = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ✅ Navbar includes alert and wrapper */}
      <Navbar />

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

        <div className="category-grid pretty">
          {[
            { title: "Business Management", cls: "cat-blue", emoji: "⚙️" },   // was ""
            { title: "Arts & Design", cls: "cat-rose", emoji: "🎨" },   // was cat-pink
            { title: "Personal Development", cls: "cat-mint", emoji: "💡" },
            { title: "UI/UX Design", cls: "cat-sand", emoji: "🖥️" },   // was cat-cream
            { title: "Graphic Design", cls: "cat-lav", emoji: "✏️" },
            { title: "Digital Marketing", cls: "cat-fuchsia", emoji: "📣" },   // was cat-rose
            { title: "Exclusive man", cls: "cat-indigo", emoji: "🏅" },
            { title: "Product Design", cls: "cat-amber", emoji: "📘" },   // was cat-sand
            { title: "Video & Photography", cls: "cat-sky", emoji: "🎬" },
          ].map((c, i) => (
            <button className={`category-card pretty ${c.cls}`} key={i} type="button">
              <span className="category-icon" aria-hidden>{c.emoji}</span>
              <span className="category-title">{c.title}</span>
            </button>
          ))}
        </div>
      </section>



      <section className="about-section">
        <div className="about-images">
          <img src={img1} alt="Teacher" className="about-img" />
        </div>
        <div className="about-text">
          <span className="about-label">OUR ABOUT US</span>
          <h2>
            Learn & Grow Your <span className="circle-highlight">Skills</span> From Anywhere
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="about-features">
            <div>
              <h4>FLEXIBLE CLASSES</h4>
              <p>Ultrice gravida dictum fusce placerat ultrices integer quis auctor elit.</p>
            </div>
            <div>
              <h4>FLEXIBLE CLASSES</h4>
              <p>Ultrice gravida dictum fusce placerat ultrices integer quis auctor elit.</p>
            </div>
          </div>
          <button className="load-more" onClick={() => navigate("/about")}>Load More →</button>
        </div>
      </section>
      <Footer />


    </>

  );
}

export default Home;
