import React, { useState } from "react";
import "./Home.css";

function Prices() {
    const [showAlert, setShowAlert] = useState(true);

    const plans = [
        {
            name: "Free",
            price: "$0",
            features: [
                { label: "Access to 5 courses", info: "Try a few courses to get started." },
                { label: "Basic support", info: "Response within 2–3 days." },
                { label: "Limited quizzes", info: "Some assessments are locked." },
            ],
            popular: false,
        },
        {
            name: "Pro",
            price: "$19/month",
            features: [
                { label: "Unlimited courses", info: "Access all courses on the platform." },
                { label: "Certificates", info: "Earn certificates for completed courses." },
                { label: "Community access", info: "Join our private learning community." },
            ],
            popular: false,
        },
        {
            name: "Premium",
            price: "$39/month",
            features: [
                { label: "1-on-1 Mentorship", info: "Get direct help from expert mentors." },
                { label: "Job assistance", info: "Resume review, mock interviews & more." },
                { label: "Priority support", info: "Live chat and same-day email replies." },
            ],
            popular: true,
        },
    ];

    const testimonials = [
        {
            name: "Sarah A.",
            feedback: "The Premium plan was a game-changer. I landed a job 1 month after completing the career path!",
        },
        {
            name: "James M.",
            feedback: "I loved the 1-on-1 mentorship. Having a real person guide me made all the difference.",
        },
        {
            name: "Lina K.",
            feedback: "As a working mom, the flexible access and supportive community helped me complete 3 certificates this year!",
        },
    ];

    return (
        <div className="home-wrapper">
            {/* 🎉 Discount Alert */}
            {showAlert && (
                <div className="cta-alert">
                    <span>🎉 Sign up now and get 25% off your first course!</span>
                    <button className="close-alert" onClick={() => setShowAlert(false)}>✖</button>
                </div>
            )}

            {/* 💰 Pricing Plans */}
            <section className="categories">
                <h2 style={{ fontSize: "42px", marginBottom: "10px" }}>Our Pricing Plans</h2>
                <p style={{ fontSize: "18px", color: "#555", marginBottom: "40px" }}>
                    Choose a plan that fits your learning style and goals.
                </p>
                <div className="category-grid">
                    {plans.map((plan, index) => (
                        <div
                            className="category-card"
                            key={index}
                            style={{
                                width: "100%",
                                maxWidth: "400px",
                                padding: "40px",
                                position: "relative",
                                border: plan.popular ? "3px solid #6c63ff" : undefined,
                            }}
                        >
                            {plan.popular && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "-15px",
                                        right: "-15px",
                                        background: "#FFD25D",
                                        color: "#222",
                                        padding: "6px 12px",
                                        fontWeight: "bold",
                                        fontSize: "13px",
                                        borderRadius: "20px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 style={{ fontSize: "32px", marginBottom: "10px" }}>{plan.name}</h3>
                            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#6c63ff" }}>{plan.price}</p>
                            <ul style={{ textAlign: "left", marginTop: "20px" }}>
                                {plan.features.map((f, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            fontSize: "17px",
                                            marginBottom: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        ✔️ {f.label}
                                        <span
                                            title={f.info}
                                            style={{
                                                fontSize: "14px",
                                                color: "#6c63ff",
                                                cursor: "help",
                                            }}
                                        >
                                            ℹ️
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <button className="load-more" style={{ marginTop: "30px", fontSize: "16px" }}>
                                Choose Plan →
                            </button>
                        </div>
                    ))}
                </div>
            </section>


            <section className="categories" style={{ marginTop: "60px" }}>
                <h2 style={{ fontSize: "36px", marginBottom: "30px" }}>What Our Learners Say</h2>
                <div className="category-grid">
                    {testimonials.map((t, i) => (
                        <div
                            className="category-card"
                            key={i}
                            style={{
                                maxWidth: "500px",
                                fontStyle: "italic",
                                fontSize: "17px",
                            }}
                        >
                            <p>“{t.feedback}”</p>
                            <p style={{ marginTop: "10px", fontWeight: "bold" }}>— {t.name}</p>
                        </div>
                    ))}
                </div>
            </section>


            <section className="categories" style={{ marginTop: "60px", textAlign: "center" }}>
                <h2 style={{ fontSize: "34px" }}>Still Not Sure?</h2>
                <p style={{ fontSize: "18px", color: "#555", marginBottom: "30px" }}>
                    Start with our free plan or talk to our team to find the right fit for you.
                </p>
                <button className="create-account" style={{ fontSize: "17px", padding: "14px 32px" }}>
                    Contact Sales
                </button>
            </section>
        </div>
    );
}

export default Prices;
