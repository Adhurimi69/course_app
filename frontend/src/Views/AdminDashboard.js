import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp, UserCircle } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);

  // Users state (admins, teachers, students)
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);

  // Filtered users combined into one list with a "role" property to identify
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          departmentsRes,
          coursesRes,
          lecturesRes,
          assignmentsRes,
          examsRes,
          adminsRes,
          teachersRes,
          studentsRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/queries/departments"),
          axios.get("http://localhost:5000/api/queries/courses"),
          axios.get("http://localhost:5000/api/queries/lectures"),
          axios.get("http://localhost:5000/api/queries/assignments"),
          axios.get("http://localhost:5000/api/queries/exams"),
          axios.get("http://localhost:5000/api/queries/admins"),
          axios.get("http://localhost:5000/api/queries/teachers"),
          axios.get("http://localhost:5000/api/queries/students"),
        ]);

        setDepartments(departmentsRes.data);
        setCourses(coursesRes.data);
        setLectures(lecturesRes.data);
        setAssignments(assignmentsRes.data);
        setExams(examsRes.data);

        setAdmins(adminsRes.data);
        setTeachers(teachersRes.data);
        setStudents(studentsRes.data);

        setFilteredDepartments(departmentsRes.data);
        setFilteredCourses(coursesRes.data);
        setFilteredLectures(lecturesRes.data);
        setFilteredAssignments(assignmentsRes.data);
        setFilteredExams(examsRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    const includes = (value) =>
      typeof value === "string" && value.toLowerCase().includes(lowerSearch);

    // Filter Departments by name (unchanged)
    const fDepartments = departments.filter((d) => includes(d.name));

    // Filter Courses by title (unchanged)
    const fCourses = courses.filter((c) => includes(c.title));

    // Filter Lectures by title (unchanged)
    const fLectures = lectures.filter((l) => includes(l.title));

    // Filter Assignments by title (unchanged)
    const fAssignments = assignments.filter((a) => includes(a.title));

    // Filter Assignments by title (unchanged)
    const fExams = exams.filter((e) => includes(e.title));

    // Combine users and filter by emri or email
    const usersCombined = [
      ...admins.map((u) => ({ ...u, role: "admin" })),
      ...teachers.map((u) => ({ ...u, role: "teacher" })),
      ...students.map((u) => ({ ...u, role: "student" })),
    ];
    const fUsers = usersCombined.filter(
      (u) => includes(u.emri) || includes(u.email)
    );

    setFilteredDepartments(fDepartments);
    setFilteredCourses(fCourses);
    setFilteredLectures(fLectures);
    setFilteredAssignments(fAssignments);
    setFilteredExams(fExams);

    setFilteredUsers(fUsers);

    setShowSearchResults(lowerSearch !== "");
  }, [
    searchTerm,
    departments,
    courses,
    lectures,
    assignments,
    exams,
    admins,
    teachers,
    students,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (type, id, role = null) => {
    setShowSearchResults(false);
    setSearchTerm("");
    switch (type) {
      case "department":
        navigate("/admins/departments", { state: { highlightId: id } });
        break;
      case "course":
        navigate("/admins/courses", { state: { highlightId: id } });
        break;
      case "lecture":
        navigate("/admins/lectures", { state: { highlightId: id } });
        break;
      case "assignment":
        navigate("/admins/assignments", { state: { highlightId: id } });
        break;
      case "exam":
        navigate("/admins/exams", { state: { highlightId: id } });
        break;
      case "user":
        // Navigate to unified users page with scroll highlight for user id and role
        navigate("/admins/users", { state: { highlightId: id, role } });
        break;
      default:
        break;
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">Admin Panel</div>
        <nav className="admin-nav">
          <ul className="space-y-2">
            <li>
              <Link to="/admins/departments" className="admin-link">
                Departments
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                className="admin-collapsible-button"
              >
                <span>Courses</span>
                {isCoursesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isCoursesOpen && (
                <ul className="ml-4 mt-1 space-y-1 text-sm">
                  <li>
                    <Link to="/admins/courses" className="admin-subitem">
                      Courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/admins/lectures" className="admin-subitem">
                      Lectures
                    </Link>
                  </li>
                  <li>
                    <Link to="/admins/assignments" className="admin-subitem">
                      Assignments
                    </Link>
                  </li>
                  <li>
                    <Link to="/admins/exams" className="admin-subitem">
                      Exams
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/admins/users" className="admin-link">
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="admin-main">
        <header
          className="admin-navbar"
          style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}
          ref={searchRef}
        >
          <Link to="/" className="admin-home-link">
            Home
          </Link>

          <input
            type="text"
            placeholder="Search departments, courses, lectures, assignments, admins, teachers, students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchTerm.trim() !== "") setShowSearchResults(true);
            }}
            style={{
              flexGrow: 1,
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              zIndex: 1000,
            }}
          />

          {showSearchResults && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 5px)",
                left: 0,
                right: 0,
                maxHeight: "300px",
                overflowY: "auto",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 9999,
              }}
            >
              {filteredDepartments.length > 0 && (
                <div style={{ padding: "0.5rem" }}>
                  <strong>Departments</strong>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {filteredDepartments.map((d) => (
                      <li
                        key={`department-${d.id}`}
                        onClick={() => handleResultClick("department", d.id)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {d.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {filteredCourses.length > 0 && (
                <div style={{ padding: "0.5rem" }}>
                  <strong>Courses</strong>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {filteredCourses.map((c) => (
                      <li
                        key={`course-${c.id}`}
                        onClick={() => handleResultClick("course", c.id)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {c.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {filteredLectures.length > 0 && (
                <div style={{ padding: "0.5rem" }}>
                  <strong>Lectures</strong>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {filteredLectures.map((l) => (
                      <li
                        key={`lecture-${l.id}`}
                        onClick={() => handleResultClick("lecture", l.id)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {l.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {filteredAssignments.length > 0 && (
                <div style={{ padding: "0.5rem" }}>
                  <strong>Assignments</strong>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {filteredAssignments.map((a) => (
                      <li
                        key={`assignment-${a.id}`}
                        onClick={() => handleResultClick("assignment", a.id)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {a.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {filteredExams.length > 0 && (
                <div style={{ padding: "0.5rem" }}>
                  <strong>Exams</strong>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {filteredExams.map((e) => (
                      <li
                        key={`exam-${e.id}`}
                        onClick={() => handleResultClick("exam", e.id)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {e.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              

              {/* Unified Users search results */}
              {filteredUsers.length > 0 && (
                <div style={{ padding: "0.5rem" }}>
                  <strong>Users</strong>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {filteredUsers.map((u) => (
                      <li
                        key={`${u.role}-${u.id}`}
                        onClick={() => handleResultClick("user", u.id, u.role)}
                        style={{
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {u.emri} ({u.email}) - <em>{u.role}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {filteredDepartments.length === 0 &&
                filteredCourses.length === 0 &&
                filteredLectures.length === 0 &&
                filteredAssignments.length === 0 &&
                filteredExams.length === 0 &&
                filteredUsers.length === 0 && (
                  <div style={{ padding: "0.5rem", color: "#777" }}>
                    No results found.
                  </div>
                )}
            </div>
          )}

          <div className="relative">
            <UserCircle
              size={32}
              className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
              onClick={() => setShowLogout((prev) => !prev)}
            />
            {showLogout && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-20 py-1">
                <LogoutButton />
              </div>
            )}
          </div>

        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
