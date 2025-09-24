// src/Views/AboutUs.jsx
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css"; // reuse shared design tokens

import studentsAbout from "../images/students-about.png";
import img1 from "../images/students.jpg";

// Shape assets
import dotsSvg from "../images/shape.svg";
import waveSvg from "../images/wave.svg";
import starSvg from "../images/image.svg";
import arcSvg from "../images/arc.svg";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="font-sans text-gray-800">
      <Navbar />

      {/* Page-specific CSS */}
      <style>{`
        .contact-hero {
          position: relative;
          background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
          text-align: center;
          padding: 100px 0 120px;
          overflow: hidden;
        }
        .contact-hero .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .contact-hero h1 {
          font-size: 36px;
          letter-spacing: 1px;
        }
        .breadcrumb {
          margin-top: 8px;
          font-size: 14px;
        }
        .breadcrumb a {
          color: #1e2a3b;
          text-decoration: none;
        }
        .breadcrumb span { margin: 0 5px; }

        /* Decorative shapes (now img elements) */
        .shape {
          position: absolute;
          pointer-events: none;
          user-select: none;
        }
        .shape-dots   { top: 30px;  left: 40px;  width: 40px;  height: 40px; }
        .shape-wave   { top: 120px; right: 80px; width: 80px;  height: 20px; }
        .shape-star   { bottom: 40px; left: 80px; width: 20px;  height: 20px; }
        .shape-arc    { bottom: -20px; right: 50px; width: 100px; height: 100px; }
      `}</style>

      {/* ABOUT hero with shapes */}
      <header className="contact-hero">
        <div className="container">
          <h1>ABOUT US</h1>
          <nav className="breadcrumb">
          </nav>
        </div>

        {/* Use <img> so bundler resolves paths reliably */}
        <img src={dotsSvg} className="shape shape-dots" alt="" />
        <img src={waveSvg} className="shape shape-wave" alt="" />
        <img src={starSvg} className="shape shape-star" alt="" />
        <img src={arcSvg} className="shape shape-arc" alt="" />
      </header>

      {/* Hero-like section (kept from your design system) */}
      <section className="hero" style={{ paddingTop: 60 }}>
        <div className="hero-text">
          <h4>ABOUT EDUNITY</h4>
          <h1>Learn, Grow, and Succeed With Us</h1>
          <p>
            Edunity empowers learners worldwide with flexible, high-quality online
            education. Our programs are designed to build real skills and unlock
            new opportunities.
          </p>
          <button className="find-course">Explore Programs</button>
        </div>
        <img src={studentsAbout} alt="Students learning online" />
      </section>

      {/* About section */}
      <section className="about-section">
        <div className="about-images">
          <img
            src={img1}
            alt="Instructor guiding students"
            className="about-img"
          />
        </div>

        <div className="about-text">
          <span className="about-label">OUR STORY</span>
          <h2>
            Building <span className="circle-highlight">Skills</span> For
            Real-World Impact
          </h2>
          <p>
            We believe learning should be accessible, practical, and inspiring.
            From beginners to professionals, our courses are crafted to help you
            achieve your goals—one milestone at a time.
          </p>

          <div className="about-features">
            <div>
              <h4>FLEXIBLE LEARNING</h4>
              <p>On-demand lessons and live sessions to fit your schedule.</p>
            </div>
            <div>
              <h4>EXPERT INSTRUCTORS</h4>
              <p>Industry professionals who teach with hands-on projects.</p>
            </div>
          </div>

          <button className="load-more">Browse Courses →</button>
        </div>
      </section>

      {/* Stats section */}
      <section className="categories" style={{ marginTop: 0 }}>
        <h2>By the Numbers</h2>
        <div className="category-grid">
          {[
            { k: "3K+", label: "Instructors" },
            { k: "15K+", label: "Active Courses" },
            { k: "97K+", label: "Happy Students" },
            { k: "102K+", label: "Certifications" },
          ].map((s, i) => (
            <div className="category-card" key={i} style={{ padding: "32px" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#6c63ff" }}>
                {s.k}
              </div>
              <div style={{ marginTop: 6, fontSize: 16 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="categories" style={{ marginTop: 40 }}>
        <h2>What Learners Say</h2>
        <div className="category-grid">
          {[
            {
              quote:
                "This platform helped me gain confidence in data science and become job-ready within 3 months.",
              name: "Kathy Davidson",
              role: "Data Analyst",
            },
            {
              quote:
                "With structured content and dedicated mentors, I finished the course while working full-time.",
              name: "Felix Ormond",
              role: "ML Engineer",
            },
          ].map((t, i) => (
            <div className="category-card" key={i} style={{ textAlign: "left" }}>
              <p style={{ fontStyle: "italic" }}>“{t.quote}”</p>
              <p style={{ marginTop: 12, fontWeight: 700 }}>
                — {t.name}{" "}
                <span style={{ color: "#6c63ff", fontWeight: 600 }}>
                  • {t.role}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
