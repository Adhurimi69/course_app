import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import studentsGroup from "../images/students-group.png";
import img1 from "../images/students.jpg";
import ins1 from "../images/ins1.jpeg";
import ins2 from "../images/ins2.jpeg";
import ins3 from "../images/ins3.jpeg";
import ins4 from "../images/ins4.jpeg";
import tra1 from "../images/tra1.jpeg";
import tra2 from "../images/tra2.jpeg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const [email, setEmail] = useState("");

  const scrollToCategories = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const instructors = [
    { id: 1, name: "Esther Howard", role: "Senior Instructor", img: ins1 },
    { id: 2, name: "Beverly Hathcock", role: "Junior Instructor", img: ins2 },
    { id: 3, name: "Donald Gonzales", role: "Junior Instructor", img: ins3 },
    { id: 4, name: "Eddie Lenz", role: "Junior Instructor", img: ins4 },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Thanks for subscribing, ${email}!`);
    setEmail("");
  };

  return (
    <>
      <Navbar />

      {/* ===== Hero ===== */}
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

      {/* ===== Categories ===== */}
      <section className="categories" ref={categoriesRef}>
        <h2>Browse By Categories</h2>

        <div className="category-grid pretty">
          {[
            { title: "Business Management", cls: "cat-blue", emoji: "⚙️" },
            { title: "Arts & Design", cls: "cat-rose", emoji: "🎨" },
            { title: "Personal Development", cls: "cat-mint", emoji: "💡" },
            { title: "UI/UX Design", cls: "cat-sand", emoji: "🖥️" },
            { title: "Graphic Design", cls: "cat-lav", emoji: "✏️" },
            { title: "Digital Marketing", cls: "cat-fuchsia", emoji: "📣" },
            { title: "Exclusive man", cls: "cat-indigo", emoji: "🏅" },
            { title: "Product Design", cls: "cat-amber", emoji: "📘" },
            { title: "Video & Photography", cls: "cat-sky", emoji: "🎬" },
          ].map((c, i) => (
            <button className={`category-card pretty ${c.cls}`} key={i} type="button">
              <span className="category-icon" aria-hidden>{c.emoji}</span>
              <span className="category-title">{c.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== About ===== */}
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

      {/* ===== Meet Our Expert Instructor ===== */}
      <section className="instructors-section">
        <div className="inst-left">
          <span className="eyebrow">OUR INSTRUCTORS</span>
          <h2 className="section-title">Meet Our Expert Instructor</h2>
          <p className="section-desc">
            Learn from elite experts, practitioners, and mentors. Our instructors blend
            real-world experience with modern teaching methods to help you master skills faster.
            Every course includes practical projects, feedback loops, and community support so you
            can apply knowledge immediately and build a job-ready portfolio.
          </p>
          <ul className="inst-points">
            <li>Real projects &amp; hands-on feedback</li>
            <li>Clear roadmaps and milestone tracking</li>
            <li>Career guidance and interview prep</li>
          </ul>
          <div className="inst-ctas">
            <button
              className="btn-outline"
              type="button"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </div>

        <div className="inst-grid">
          {instructors.map((t, idx) => (
            <article className={`inst-card ${idx % 2 ? "accent-2" : "accent-1"}`} key={t.id}>
              <button className="inst-share" aria-label={`Share ${t.name}`} type="button">↗</button>
              <img src={t.img} alt={t.name} className="inst-photo hoverable" />
              <div className="inst-chip">
                <div className="inst-name">{t.name}</div>
                <div className="inst-role">{t.role}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== Discover Your Gain ===== */}
      <section className="discover-section">
        <span className="eyebrow center">CHOOSE YOUR CAREER</span>
        <h2 className="section-title center">Discover Your Gain</h2>

        <div className="promo-grid">
          {/* Card 1 – Skills focus */}
          <article className="promo-card purple hover-card">
            <div className="promo-copy">
              <span className="promo-eyebrow">Start From Today</span>
              <h3>Join Our Training Courses &amp; Build Your Skill.</h3>
              <button className="promo-btn">Join Now →</button>
            </div>
            <img src={tra1} alt="Student building skills" className="promo-img hoverable" />
          </article>

          {/* Card 2 – Career path focus */}
          <article className="promo-card amber hover-card">
            <div className="promo-copy">
              <span className="promo-eyebrow">Upskill Faster</span>
              <h3>Career-Focused Paths with Mentors, Projects &amp; Certificates.</h3>
              <button className="promo-btn">Explore Tracks →</button>
            </div>
            <img src={tra2} alt="Learner advancing career" className="promo-img hoverable" />
          </article>
        </div>
      </section>

      {/* ===== Newsletter ===== */}
      <section className="newsletter">
        <div className="newsletter-inner">
          <div className="newsletter-copy">
            <h3>Join Our Newsletter</h3>
            <p>Subscribe to our newsletter to get our latest updates &amp; news.</p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
