import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/app');
  };

  return (
    <div className="home-wrapper">
      <header className="top-bar">
        <div className="contact-info">
          📞 (001) 875-734-5261 | 📧 peaceprince01@gmail.com | 📍 225, Atirumadb, Mexico - USA
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
          <p>We are specialized in educational platforms and skilled strategies for the success of online learners.</p>
          <button className="find-course">Find Courses</button>
        </div>
        <img src="https://via.placeholder.com/400x300" alt="Students Group" />
      </section>

      <section className="categories">
        <h2>Browse By Categories</h2>
        <div className="category-grid">
          {[
            'Business Management',
            'Arts & Design',
            'Personal Development',
            'UI/UX Design',
            'Graphic Design',
            'Digital Marketing',
            'Exclusive man',
            'Product Design',
            'Video & Photography',
          ].map((cat, i) => (
            <div className="category-card" key={i}>
              {cat}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
