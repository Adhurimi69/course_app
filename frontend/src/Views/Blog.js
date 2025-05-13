import React, { useState } from "react";
import "./Home.css";
import blogImg0 from "../images/blog0.jpeg";
import blogImg1 from "../images/blog1.jpeg";
import blogImg2 from "../images/blog2.png";
import blogImg3 from "../images/blog3.png";
import blogImg4 from "../images/blog4.jpeg";
import blogImg5 from "../images/blog5.jpeg";
import blogImg6 from "../images/blog6.png";

function Blog() {
    const [showAlert, setShowAlert] = useState(true);

    const posts = [
        {
            id: 1,
            title: "How to Stay Motivated in Online Learning",
            date: "May 13, 2025",
            excerpt: "Discover tips and strategies to keep yourself engaged and motivated throughout your online learning journey.",
            image: blogImg1,
        },
        {
            id: 2,
            title: "Top 5 Skills You Can Learn in 2025",
            date: "May 10, 2025",
            excerpt: "Stay ahead in your career by mastering these high-demand skills in 2025. Read on to find out more.",
            image: blogImg2,
        },
        {
            id: 3,
            title: "The Future of Remote Education",
            date: "April 30, 2025",
            excerpt: "Remote education is evolving fast—here’s how platforms are adapting to create better student experiences.",
            image: blogImg3,
        },
        {
            id: 4,
            title: "Why Soft Skills Matter More Than Ever",
            date: "April 15, 2025",
            excerpt: "Emotional intelligence, communication, and leadership are the game-changers in the digital workforce.",
            image: blogImg4,
        },
        {
            id: 5,
            title: "Choosing the Right Online Course for You",
            date: "April 1, 2025",
            excerpt: "Not all courses are created equal. Here's how to find one that fits your goals, time, and learning style.",
            image: blogImg5,
        },
        {
            id: 6,
            title: "How AI Is Transforming Education",
            date: "March 20, 2025",
            excerpt: "From personalized learning paths to smart grading systems, explore how AI is reshaping online education.",
            image: blogImg6,
        },
    ];

    return (
        <div className="home-wrapper">
            {/* 🎉 Discount alert like on Home */}
            {showAlert && (
                <div className="cta-alert">
                    <span>🎉 Sign up now and get 25% off your first course!</span>
                    <button className="close-alert" onClick={() => setShowAlert(false)}>✖</button>
                </div>
            )}

            {/* 🔠 Enlarged blog header */}
            <div className="hero">
                <div className="hero-text">
                    <h4 style={{ fontSize: "26px", letterSpacing: "1px" }}>OUR BLOG</h4>
                    <h1 style={{ fontSize: "60px", fontWeight: "bold" }}>
                        Stay Updated With Edunity Insights
                    </h1>
                    <p style={{ fontSize: "20px" }}>
                        Explore articles, tips, and educational resources curated for your success.
                    </p>
                </div>
                <img src={blogImg0} alt="Blog Hero" />
            </div>

            <section className="categories">
                <h2>Latest Blog Posts</h2>
                <div className="category-grid">
                    {posts.map((post) => (
                        <div className="category-card" key={post.id}>
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{
                                    width: "100%",
                                    borderRadius: "12px",
                                    marginBottom: "15px",
                                    height: "200px",
                                    objectFit: "cover"
                                }}
                            />
                            <h3>{post.title}</h3>
                            <p style={{ fontSize: "14px", color: "#777", marginBottom: "10px" }}>{post.date}</p>
                            <p style={{ fontSize: "15px", marginBottom: "10px" }}>{post.excerpt}</p>
                            <button className="load-more">Read More →</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Blog;
