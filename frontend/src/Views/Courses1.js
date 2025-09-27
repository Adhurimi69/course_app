import React from "react";
import { useNavigate } from "react-router-dom";
import "./Courses1.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* Reuse any images you already have in /images */
import imgA from "../images/students.jpg";
import imgB from "../images/students-group.png";
import imgC from "../images/tra1.jpeg";
import imgD from "../images/tra2.jpeg";
import imgE from "../images/ins1.jpeg";
import imgF from "../images/ins2.jpeg";

const COURSES = [
    {
        id: 1,
        title: "It Statistics Data Science And Business Analysis",
        category: "Digital Marketing",
        lessons: 10,
        duration: "7h:30m",
        students: "20+",
        instructor: "Samantha",
        price: 51,
        rating: 4.8,
        img: imgA,
    },
    {
        id: 2,
        title: "Bilginer Adobe Illustrator For Graphic Design",
        category: "Digital Marketing",
        lessons: 10,
        duration: "7h:30m",
        students: "20+",
        instructor: "Charles",
        price: 51,
        rating: 4.8,
        img: imgC,
    },
    {
        id: 3,
        title: "Starting SEO As Your Home Based Business",
        category: "Digital Marketing",
        lessons: 10,
        duration: "7h:30m",
        students: "20+",
        instructor: "Morgan",
        price: 51,
        rating: 4.8,
        img: imgB,
    },
    {
        id: 4,
        title: "Bilginer Adobe Illustrator For Graphic Design",
        category: "Digital Marketing",
        lessons: 10,
        duration: "7h:30m",
        students: "20+",
        instructor: "Brian Brower",
        price: 51,
        rating: 4.8,
        img: imgD,
    },
    {
        id: 5,
        title: "It Statistics Data Science And Business Analysis",
        category: "Digital Marketing",
        lessons: 10,
        duration: "7h:30m",
        students: "20+",
        instructor: "Rokhsaar",
        price: 51,
        rating: 4.8,
        img: imgE,
    },
    {
        id: 6,
        title: "Starting SEO As Your Home Based Business",
        category: "Digital Marketing",
        lessons: 10,
        duration: "7h:30m",
        students: "20+",
        instructor: "Morgan",
        price: 51,
        rating: 4.8,
        img: imgF,
    },
];

export default function Courses() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />

            {/* ===== Hero/Breadcrumb ===== */}
            <header className="courses-hero">
                <div className="courses-hero-inner">
                    <h1>COURSE STYLE 1</h1>
                    <nav aria-label="Breadcrumb" className="crumbs">
                        <button onClick={() => navigate("/")} className="crumb-link">Home</button>
                        <span className="crumb-sep">/</span>
                        <span className="crumb-current">Course</span>
                    </nav>
                </div>
            </header>

            {/* ===== Intro Row ===== */}
            <section className="courses-intro container">
                <div className="intro-left">
                    <span className="eyebrow">TOP POPULAR COURSE</span>
                    <h2 className="intro-title">
                        Edunity Course <span className="circle-highlight">Student</span> Can
                        Join With Us.
                    </h2>
                </div>
                <div className="intro-right">
                    <button className="load-more more-compact">
                        Load More Course →
                    </button>
                </div>
            </section>

            {/* ===== Grid ===== */}
            <section className="container">
                <div className="courses-grid">
                    {COURSES.map((c) => (
                        <article className="course-card hover-card" key={c.id}>
                            <div className="thumb-wrap">
                                <img src={c.img} alt={c.title} className="course-thumb hoverable" />
                                <span className="course-chip">{c.category}</span>
                            </div>

                            <div className="course-body">
                                <div className="course-meta-top">
                                    <span className="rating">★ {c.rating}</span>
                                    <span className="price">${c.price}.00</span>
                                </div>

                                <h3 className="course-title">{c.title}</h3>

                                <ul className="facts">
                                    <li>📘 Lesson {c.lessons}</li>
                                    <li>⏱ {c.duration}</li>
                                    <li>👥 Students {c.students}</li>
                                </ul>

                                <div className="course-footer">
                                    <div className="teacher">
                                        <span className="teacher-avatar" aria-hidden>👩‍🏫</span>
                                        <span>{c.instructor}</span>
                                    </div>
                                    <button className="enroll-btn" type="button" 
                                    onClick={() => navigate("/signup")}
                                    >Enroll →</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <Footer />
        </>
    );
}
