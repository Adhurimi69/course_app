import React, { useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Reuse global design (cards, grid, colors)
import "./Home.css";
// Page-specific styles
import "./Contact.css";

// Decorative shapes (kept — they’re part of the hero, not the cards)
import dotsSvg from "../images/shape.svg";
import waveSvg from "../images/wave.svg";
import starSvg from "../images/image.svg";
import arcSvg from "../images/arc.svg";

export default function ContactUs() {
    // Scroll to top on mount (prevents landing mid-page)
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, []);

    // Live availability (Mon–Fri, 9–17) — used only for pill text
    const nowInfo = useMemo(() => {
        const now = new Date();
        const day = now.getDay(); // 0 Sun ... 6 Sat
        const hour = now.getHours() + now.getMinutes() / 60;
        const isWeekday = day >= 1 && day <= 5;
        const openHour = 9;
        const closeHour = 17;
        const isOpen = isWeekday && hour >= openHour && hour < closeHour;

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let nextOpenText = "Mon 09:00";
        if (!isOpen) {
            const next = new Date(now);
            if (isWeekday && hour < openHour) {
                // today at 9:00
            } else {
                // push to next weekday
                do {
                    next.setDate(next.getDate() + 1);
                } while (next.getDay() === 0 || next.getDay() === 6);
            }
            next.setHours(openHour, 0, 0, 0);
            nextOpenText = `${dayNames[next.getDay()]} 09:00`;
        }

        return { isOpen, nextOpenText };
    }, []);

    return (
        <>
            <Navbar />

            {/* HERO — matches your visual system */}
            <header className="contact-hero">
                <div className="container">
                    <h1>CONTACT US</h1>
                    <nav className="breadcrumb">
                    </nav>
                </div>

                {/* Decorative shapes */}
                <img src={dotsSvg} className="shape shape-dots" alt="" />
                <img src={waveSvg} className="shape shape-wave" alt="" />
                <img src={starSvg} className="shape shape-star" alt="" />
                <img src={arcSvg} className="shape shape-arc" alt="" />
            </header>

            {/* CONTENT — uses your categories + card visuals */}
            <main className="categories contact-categories">
                <h2>Get in Touch</h2>
                <p style={{ fontSize: 18, color: "#555", marginBottom: 30 }}>
                    Suspendisse ultricies gravida dictum fusce placerat ultricies integer.
                </p>

                <div className="category-grid contact-grid-equal">
                    {/* LEFT: Info card — text nudged down via extra top padding */}
                    <div className="category-card contact-info-card">
                        {/* Availability (keep “We’ll be back …” when closed) */}
                        <div
                            className={`status-pill ${nowInfo.isOpen ? "open" : "closed"}`}
                            title={nowInfo.isOpen ? "We’re currently within business hours." : "We’re currently closed."}
                            style={{ marginBottom: 12 }}
                        >
                            <span className="dot" />
                            {nowInfo.isOpen ? "We’re online now" : `We’ll be back • ${nowInfo.nextOpenText}`}
                        </div>

                        {/* Contact info — text-only */}
                        <div className="info-row no-icon">
                            <div>
                                <h4 className="info-heading">Our Address</h4>
                                <p className="info-text">
                                    1564 Goosetown Drive
                                    <br />
                                    Matthews, NC 28105
                                </p>
                            </div>
                        </div>

                        <div className="info-row no-icon">
                            <div>
                                <h4 className="info-heading">Hours Of Operation</h4>
                                <p className="info-text">
                                    Mon - Fri: 9.00am to 5.00pm
                                    <br />
                                    (2nd Sat Holiday)
                                </p>
                            </div>
                        </div>

                        <div className="info-row no-icon">
                            <div>
                                <h4 className="info-heading">Contact</h4>
                                <p className="info-text">
                                    +99 - 35895-4565
                                    <br />
                                    supportyou@info.com
                                </p>
                            </div>
                        </div>

                        {/* spacer pushes stats to the bottom */}
                        <div className="push-space" />

                        {/* Friendly, simple stats — pinned to bottom */}
                        <ul className="stat-strip" aria-label="Service stats">
                            <li>
                                <span className="stat-number">~4h</span>
                                <span className="stat-label">Reply time</span>
                            </li>
                            <li>
                                <span className="stat-number">98%</span>
                                <span className="stat-label">Happy customers</span>
                            </li>
                            <li>
                                <span className="stat-number">12k+</span>
                                <span className="stat-label">Requests solved</span>
                            </li>
                        </ul>
                    </div>

                    {/* RIGHT: Form card — same height as left */}
                    <form className="category-card contact-form-card">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Name*</label>
                                <input type="text" placeholder="Name" />
                            </div>
                            <div className="form-group">
                                <label>Email Address*</label>
                                <input type="email" placeholder="Email" />
                            </div>
                            <div className="form-group">
                                <label>Phone*</label>
                                <input type="tel" placeholder="Phone" />
                            </div>
                            <div className="form-group">
                                <label>Subject*</label>
                                <input type="text" placeholder="Subject" />
                            </div>
                            <div className="form-group">
                                <label>Message*</label>
                                <textarea rows="5" placeholder="Message"></textarea>
                            </div>

                            <button type="submit" className="load-more" style={{ alignSelf: "start", marginTop: 6 }}>
                                Send Message →
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    );
}
