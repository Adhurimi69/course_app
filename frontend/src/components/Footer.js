// src/components/Footer.jsx
import React from "react";
import "./Footer.css";

// Default social icons (override via props if you like)
import socialTwitter from "../images/twitter.png";
import socialFacebook from "../images/facebook.png";
import socialInstagram from "../images/instagram.png";
import socialLinkedIn from "../images/linkedin.png";


const Footer = ({
    brand = "edunity",
    year = new Date().getFullYear(),
    socials = [
        { href: "#", src: socialFacebook, alt: "Facebook" },
        { href: "#", src: socialTwitter, alt: "Twitter" },
        { href: "#", src: socialInstagram, alt: "Instagram" },
        { href: "#", src: socialLinkedIn, alt: "LinkedIn" },
    ],
    intro = "We are a leading educational platform providing resources for students to succeed. Our mission is to make learning accessible to everyone.",
    showIntro = true,
    services = ["Web Development", "UI/UX Design", "Management", "Digital Marketing", "Blog News"],
    showServices = true,
    contact = {
        address: "📍 225, Atirumadb, Mexico - USA",
        phone: "📞 (001) 875-734-5261",
        email: "📧 peaceprince01@gmail.com",
        policyHref: "/privacy-policy",
    },
    showContact = true,
    showGallery = false,
    gallery = [],
    className = "",
}) => {
    return (
        <footer className={`site-footer ${className}`}>
            {/* Background layer (styled in Footer.css) */}
            <div className="footer-bg" />

            <div className="footer-content">
                {/* Logo spot (hook up an <img> if you have one) */}
                <a href="/" className="logo-link" aria-label={`${brand} home`}></a>

                {showIntro && (
                    <p className="intro">{intro}</p>
                )}

                {/* Socials */}
                {!!socials?.length && (
                    <div className="social" aria-label="Social links">
                        {socials.map(({ href, src, alt }, i) => (
                            <a key={i} href={href} className="icon" aria-label={alt}>
                                <img src={src} alt={alt} />
                            </a>
                        ))}
                    </div>
                )}

                {/* Services column */}
                {showServices && (
                    <div className="footer-column services">
                        <h4>Our Services</h4>
                        <ul>
                            {services.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Contact column */}
                {showContact && (
                    <div className="footer-column quick-links">
                        <h4>Contact Us</h4>
                        <ul>
                            {contact.address && <li>{contact.address}</li>}
                            {contact.phone && <li>{contact.phone}</li>}
                            {contact.email && <li>{contact.email}</li>}
                            {contact.policyHref && (
                                <li>
                                    <a href={contact.policyHref}>Privacy Policy</a>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Optional gallery */}
                {showGallery && (
                    <div className="gallery" aria-label="Gallery">
                        {gallery.length
                            ? gallery.map((src, i) => (
                                <div key={i} className="thumb">
                                    <img src={src} alt={`gallery-${i}`} />
                                </div>
                            ))
                            : null}
                    </div>
                )}
            </div>

            <div className="bottom-bar">
                <span>© {year}</span>
                <span className="brand">{brand}</span>
                <span>All Rights Reserved</span>
            </div>
        </footer>
    );
};

export default Footer;
