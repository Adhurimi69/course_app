import React from 'react';
import Navbar from '../components/Navbar';
import './Contact.css';

export default function ContactUs() {
    return (
        <>
            <Navbar />

            <header className="contact-hero">
                <div className="container">
                    <h1>CONTACT US</h1>
                    <nav className="breadcrumb">
                        <a href="/">Home</a> <span>/</span> <span>Contact Us</span>
                    </nav>
                </div>
                {/* Decorative shapes: ensure you have these SVGs in public/icons */}
                <div className="shape shape-dots" />
                <div className="shape shape-wave" />
                <div className="shape shape-star" />
                <div className="shape shape-arc" />
            </header>

            <main className="contact-content">
                <div className="container get-in-touch">
                    <h2>Get in Touch</h2>
                    <p>Suspendisse ultricies gravida dictum fusce placerat ultricies integer.</p>

                    <div className="contact-cards">
                        {/* ─── Info Card ─── */}
                        <div className="info-card">
                            <div className="info-item">
                                <img src="/icons/map.svg" className="icon" alt="Map Marker" />
                                <div>
                                    <h4>Our Address</h4>
                                    <p>
                                        1564 Goosetown Drive<br />
                                        Matthews, NC 28105
                                    </p>
                                </div>
                            </div>

                            <div className="info-item">
                                <img src="/icons/clock.svg" className="icon" alt="Clock" />
                                <div>
                                    <h4>Hours Of Operation</h4>
                                    <p>
                                        Mon - Fri: 9.00am to 5.00pm<br />
                                        (2nd Sat Holiday)
                                    </p>
                                </div>
                            </div>

                            <div className="info-item">
                                <img src="/icons/phone.svg" className="icon" alt="Phone" />
                                <div>
                                    <h4>Contact</h4>
                                    <p>
                                        +99 - 35895-4565<br />
                                        supportyou@info.com
                                    </p>
                                </div>
                            </div>

                            {/* Button styled as link */}
                            <button type="button" className="customer-care">
                                Customer Care
                            </button>

                            <div className="social-icons">
                                <button type="button" className="social-btn">
                                    <img src="/icons/facebook.svg" alt="Facebook" />
                                </button>
                                <button type="button" className="social-btn">
                                    <img src="/icons/twitter.svg" alt="Twitter" />
                                </button>
                                <button type="button" className="social-btn">
                                    <img src="/icons/instagram.svg" alt="Instagram" />
                                </button>
                                <button type="button" className="social-btn">
                                    <img src="/icons/linkedin.svg" alt="LinkedIn" />
                                </button>
                            </div>
                        </div>

                        {/* ─── Contact Form ─── */}
                        <form className="contact-form">
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
                                <textarea rows="4" placeholder="Message"></textarea>
                            </div>
                            <button type="submit" className="submit-btn">
                                SEND MESSAGE
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container footer-contact">
                    <div className="footer-item">
                        <img src="/Location-icon.png" alt="Address Icon" className="footer-icon" />
                        <div>
                            <h4>Address</h4>
                            <p>1925 Boggess Street</p>
                        </div>
                    </div>
                    <div className="footer-item">
                        <img src="/Overlay+Border.png" alt="Phone Icon" className="footer-icon" />
                        <div>
                            <h4>Phone</h4>
                            <p>(00) 875 784 568</p>
                        </div>
                    </div>
                    <div className="footer-item">
                        <img src="/email-icon.png" alt="Email Icon" className="footer-icon" />
                        <div>
                            <h4>Email</h4>
                            <p>info@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="container footer-main">
                <div className="footer-about">
                    <h2>edunity</h2>
                    <p>
                        Interndum velit laoreet id donec ultrices tincidunt arcu.
                        Tristique tortor aliquam mattis orci fermentum ornare eu.
                    </p>
                    <div className="social-icons">
                        <button type="button" className="social-btn">
                            <img src="/icons/facebook.svg" alt="Facebook" />
                        </button>
                        <button type="button" className="social-btn">
                            <img src="/icons/twitter.svg" alt="Twitter" />
                        </button>
                        <button type="button" className="social-btn">
                            <img src="/icons/instagram.svg" alt="Instagram" />
                        </button>
                        <button type="button" className="social-btn">
                            <img src="/icons/linkedin.svg" alt="LinkedIn" />
                        </button>
                    </div>
                </div>

                <div className="footer-services">
                    <h4>Our Services</h4>
                    <ul>
                        <li>Web Development</li>
                        <li>UI/UX Design</li>
                        <li>Management</li>
                        <li>Digital Marketing</li>
                        <li>Blog News</li>
                    </ul>
                </div>

                <div className="footer-gallery">
                    <h4>Gallery</h4>
                    <div className="gallery-grid">
                        <img src="https://via.placeholder.com/80" alt="" />
                        <img src="https://via.placeholder.com/80" alt="" />
                        <img src="https://via.placeholder.com/80" alt="" />
                        <img src="https://via.placeholder.com/80" alt="" />
                    </div>
                </div>

                <div className="footer-subscribe">
                    <h4>Subscribe</h4>
                    <p>Enter your email to get our latest news</p>
                    <div className="subscribe-form">
                        <input type="email" placeholder="Enter your email" />
                        <button type="button">SUBSCRIBE NOW</button>
                    </div>
                </div>
            </div>

            <div className="container footer-bottom">
                <p>© 2024 edunity | All Rights Reserved</p>
            </div>
        </footer>
    );
}
