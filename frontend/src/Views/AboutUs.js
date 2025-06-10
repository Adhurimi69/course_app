import React from "react";
import Navbar from "../components/Navbar";
import studentsAbout from "../images/students-about.png";

const AboutUs = () => {
  return (
    <div className="font-sans text-gray-800">
      <Navbar />

      <section className="flex flex-col md:flex-row items-center justify-center px-6 py-12 gap-8 max-w-7xl mx-auto">
        <div className="flex-shrink-0">
          <img src={studentsAbout} alt="Students" className="rounded-xl" />
        </div>
        <div className="max-w-lg text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <div className="bg-red-500 text-white text-sm px-4 py-2 rounded-full font-semibold">
              95% Team Experience
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Benefit From Our Online Learning Expertise Earn Professional
          </h2>
          <p className="text-gray-600 mb-6">
            Online learning offers a new way to explore subjects you're
            passionate about. With flexible access and a wide variety of topics,
            learning has never been easier.
          </p>
          <div className="space-y-2">
            <div>
              <strong>Course Benefits:</strong> Flexible, Interactive, Certified
            </div>
            <div>
              <strong>Expert Mentors:</strong> Highly Qualified Instructors
            </div>
          </div>
          <button className="mt-6 px-6 py-3 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-orange-500 text-white py-10 text-center grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
        <div>
          <div className="text-3xl font-bold">3K+</div>
          <div>Instructors</div>
        </div>
        <div>
          <div className="text-3xl font-bold">15K+</div>
          <div>Active Courses</div>
        </div>
        <div>
          <div className="text-3xl font-bold">97K+</div>
          <div>Happy Students</div>
        </div>
        <div>
          <div className="text-3xl font-bold">102K+</div>
          <div>Certifications</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">
          Creating A Community Of Life Long Learners.
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <p className="italic mb-4">
              “This platform helped me gain confidence in data science and
              become job-ready within 3 months.”
            </p>
            <div className="font-semibold">Kathy Davidson - Data Analyst</div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <p className="italic mb-4">
              “With structured content and dedicated mentors, I finished the
              course while working full-time.”
            </p>
            <div className="font-semibold">Felix Ormond - ML Engineer</div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-white py-16 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">
            Creating A Community Of Life Long Learners.
          </h2>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-md shadow hover:bg-orange-600 transition">
            Join Courses
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border rounded-lg overflow-hidden shadow"
            >
              <img
                src="https://via.placeholder.com/400x200"
                alt="Course"
                className="w-full"
              />
              <div className="p-4">
                <div className="text-xs text-purple-600 mb-1">12 Sessions</div>
                <h3 className="font-bold mb-2 text-lg">
                  Data Science and Business Analytics
                </h3>
                <div className="text-sm text-gray-600">
                  Instructor: John Doe
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instructors */}
      <section className="bg-gray-100 py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8">Meet Our Instructor</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: "Michael Hammond", role: "Instructor" },
            { name: "Cheryl Curry", role: "Trainer" },
            { name: "Niko Shaw", role: "Trainer" },
            { name: "Jenny Sharlette", role: "Instructor" },
          ].map((instructor, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <img
                src="https://via.placeholder.com/150"
                alt={instructor.name}
                className="rounded-full mx-auto mb-4"
              />
              <div className="font-bold">{instructor.name}</div>
              <div className="text-sm text-gray-500">{instructor.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div>
            <h3 className="text-xl font-bold mb-4">edunity</h3>
            <p className="text-sm text-gray-400">
              A platform committed to lifelong learning and career growth.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="w-6 h-6 bg-white rounded-full" />
              <span className="w-6 h-6 bg-white rounded-full" />
              <span className="w-6 h-6 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Learning Paths</li>
              <li>Live Classes</li>
              <li>Certifications</li>
              <li>Workshops</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Gallery</h4>
            <div className="grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, i) => (
                <img
                  key={i}
                  src="https://via.placeholder.com/60"
                  alt="gallery"
                  className="rounded"
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Subscribe</h4>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-3 py-2 mb-2 text-black rounded"
            />
            <button className="w-full bg-orange-500 py-2 rounded hover:bg-orange-600">
              Subscribe
            </button>
          </div>
        </div>
        <div className="text-center text-sm text-gray-400 mt-10">
          © 2025 edunity. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
