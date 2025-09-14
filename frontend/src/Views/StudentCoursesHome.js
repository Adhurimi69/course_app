import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
console.log("StudentCoursesHome mounted");

export default function StudentCoursesHome() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const studentId = JSON.parse(localStorage.getItem("user"))?.id;
  console.log("Student ID:", studentId);
  console.log("User data:", JSON.parse(localStorage.getItem("user")));
  useEffect(() => {
    console.log("StudentCoursesHome useEffect running, studentId:", studentId);
    if (studentId) {
      console.log("Calling fetchCourses with studentId:", studentId);
      fetchCourses();
    } else {
      console.log("No studentId found in localStorage");
    }
  }, [studentId]);

  const fetchCourses = async () => {
    console.log("fetchCourses called");

    try {
      const enrolledRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/enrolled/${studentId}`
      );
      console.log("Enrolled response:", enrolledRes.data);
      const availableRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/available/${studentId}`
      );
      console.log("Available response:", availableRes.data);
      setEnrolledCourses(enrolledRes.data);
      setAvailableCourses(availableRes.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const enrollCourse = async (courseId) => {
    try {
      await axios.post("http://localhost:5000/api/commands/student-courses", {
        studentId,
        courseId,
      });
      fetchCourses(); // Refresh lists
    } catch (err) {
      console.error("Failed to enroll:", err);
    }
  };

  return (
    <>
      <div>
        <h2>Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <p>No enrolled courses.</p>
        ) : (
          <div className="course-card-list">
            {enrolledCourses.map((courseCard) => (
              <div key={courseCard.courseId} className="course-card enrolled">
                <h3>{courseCard.Course?.title}</h3>
                <p>
                  <strong>Course ID:</strong> {courseCard.Course?.id}
                </p>
                <p>
                  <strong>Department:</strong> {courseCard.Course?.departmentId}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2>Available Courses</h2>
        {availableCourses.length === 0 ? (
          <p>No available courses.</p>
        ) : (
          availableCourses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>Course ID: {course.id}</p>
              <p>Department: {course.departmentId}</p>
              <button onClick={() => enrollCourse(course.id)}>Enroll</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
