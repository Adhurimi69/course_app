// src/Views/Courses.js
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CourseModal from "../components/CourseModal";
import CourseCard from "../components/CourseCard";
import GradeMatrix from "../components/GradeMatrix";
import SingleStudentGradeDialog from "../components/SingleStudentGradeDialog";
import "./AdminDashboard.css";

export default function Courses({ teacherView = false, studentView = false }) {
  const location = useLocation();
  const isViewingCourse = /^\/students\/courses\/\d+/.test(location.pathname);
  const studentId = JSON.parse(localStorage.getItem("user"))?.id;

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  // IMAGE STATES
  const [selectedImageCourseId] = useState(null);
  // pending image preview state (not used in this view)
  const [previewImage, setPreviewImage] = useState(null);

  // Admin inline form states
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [enrollmentKey, setEnrollmentKey] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");

  // Track key input per course
  // key input map (not used currently)
  // Modal state for key entry
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [modalCourseId, setModalCourseId] = useState(null);
  const [modalKey, setModalKey] = useState("");
  // Student upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadCourse, setUploadCourse] = useState(null);
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [courseExams, setCourseExams] = useState([]);
  const [selectedUploadAssignment, setSelectedUploadAssignment] = useState('');
  const [selectedUploadExam, setSelectedUploadExam] = useState('');
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const [uploadingCourseFile, setUploadingCourseFile] = useState(false);
  // Grades modal (student-facing)
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradeModalCourse, setGradeModalCourse] = useState(null);
  const [assignmentGradesForCourse, setAssignmentGradesForCourse] = useState([]);
  const [courseGradesForCourse, setCourseGradesForCourse] = useState([]);
  const [editingScores, setEditingScores] = useState({});
  const [studentsForCourse, setStudentsForCourse] = useState([]);
  const [assignmentsForCourse, setAssignmentsForCourse] = useState([]);
  const [matrixEditing, setMatrixEditing] = useState({});
  const [assignmentAllGraderOpen, setAssignmentAllGraderOpen] = useState(false);
  const [assignmentToGradeAll, setAssignmentToGradeAll] = useState(null);
  const [assignmentAllEditing, setAssignmentAllEditing] = useState({});
  const [examAllGraderOpen, setExamAllGraderOpen] = useState(false);
  const [examToGradeAll, setExamToGradeAll] = useState(null);
  const [examAllEditing, setExamAllEditing] = useState({});
  const [assignmentPoints, setAssignmentPoints] = useState({});
  const [examPoints, setExamPoints] = useState({});
  const [studentGraderOpen, setStudentGraderOpen] = useState(false);
  const [studentToGrade, setStudentToGrade] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null') || {};
  const role = localStorage.getItem('role') || currentUser?.role;

  // ---------- helper: normalize course for cards ----------
  const normalizeCourseForCard = (c) => {
    const courseId = c?.courseId ?? c?.id;
    return {
      ...c,
      id: courseId,
      courseId,
      imageUrl: localStorage.getItem(`course_img_${courseId}`) || null,
    };
  };

  useEffect(() => {
    fetchDepartments();
    if (studentView) {
      fetchStudentCourses();
    } else {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/courses");
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const unEnrollCourse = async (courseId) => {
    try {
      await axios.delete("http://localhost:5000/api/commands/student-courses", {
        data: { studentId, courseId },
      });
      fetchStudentCourses();
    } catch (err) {
      console.error("Unenrollment failed:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/queries/departments"
      );
      setDepartments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentCourses = async () => {
    try {
      const enrolledRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/enrolled/${studentId}`
      );
      setEnrolledCourses(enrolledRes.data || []);
      const availableRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/available/${studentId}`
      );
      setAvailableCourses(availableRes.data || []);
    } catch (err) {
      console.error("Error fetching student courses:", err);
    }
  };

  const handleCourseImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      if (selectedImageCourseId) {
        localStorage.setItem(
          `course_img_${selectedImageCourseId}`,
          reader.result
        );
      } else {
        // preview only
      }
    };
    reader.readAsDataURL(file);
  };

  const enrollCourse = async (courseId, key = "") => {
    try {
      await axios.post("http://localhost:5000/api/commands/student-courses", {
        studentId,
        courseId,
        key,
      });
      fetchStudentCourses();
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  // accepts either a course object or a courseId
  const handleEnrollClick = (arg) => {
    const courseId =
      typeof arg === "object" ? arg.courseId ?? arg.id : Number(arg);
    if (!courseId) return;
    const course =
      typeof arg === "object" ? arg : availableCourses.find((c) => (c.id ?? c.courseId) === courseId);

    if (course?.hasEnrollmentKey) {
      setModalCourseId(courseId);
      setModalKey("");
      setKeyModalOpen(true);
    } else {
      enrollCourse(courseId);
    }
  };

  const handleModalEnroll = () => {
    if (!modalCourseId) return;
    enrollCourse(modalCourseId, modalKey);
    setKeyModalOpen(false);
  };

  const openUploadModalForCourse = async (course) => {
    setUploadCourse(course);
    setSelectedUploadAssignment('');
    setSelectedUploadExam('');
    setSelectedUploadFile(null);
    // fetch assignments and exams for this course
    try {
      const [assignRes, examRes] = await Promise.all([
        axios.get('http://localhost:5000/api/queries/assignments'),
        axios.get(`http://localhost:5000/api/queries/exams/course/${course.courseId}`),
      ]);
      const assignments = (assignRes.data || []).filter(a => String(a.courseId) === String(course.courseId));
      setCourseAssignments(assignments);
      setCourseExams(examRes.data || []);
    } catch (err) {
      console.error('Failed to fetch course assignments/exams', err);
      setCourseAssignments([]);
      setCourseExams([]);
    }
    setUploadModalOpen(true);
  };

  const doCourseUpload = async () => {
    if (!selectedUploadFile) return alert('Choose a file');
    if (!uploadCourse) return;
    // Students may only upload to assignments, not exams
    const user = JSON.parse(localStorage.getItem('user') || 'null') || {};
    const role = localStorage.getItem('role') || user?.role;
    if (!selectedUploadAssignment && !selectedUploadExam) return alert('Choose assignment or exam');
    if (role === 'student' && selectedUploadExam) return alert('Students are not allowed to upload to exams. Choose an assignment.');
    const fd = new FormData();
    if (selectedUploadAssignment) fd.append('assignmentId', selectedUploadAssignment);
    if (selectedUploadExam) fd.append('examId', selectedUploadExam);
    if (user?.id) fd.append('studentId', user.id);
    fd.append('file', selectedUploadFile);
    try {
      setUploadingCourseFile(true);
      const token = localStorage.getItem('accessToken');
      const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
      await axios.post(`${base}/api/commands/upload`, fd, { headers: { Authorization: `Bearer ${token}` } });
      alert('Upload successful');
      setUploadModalOpen(false);
    } catch (err) {
      console.error('Upload failed', err.response?.data || err.message);
      alert('Upload failed');
    } finally {
      setUploadingCourseFile(false);
    }
  };

  // Grades: open modal and fetch grades for the logged-in student for this course
  const openGradeModalForCourse = async (course) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null') || {};
    if (!user?.id) return alert('Not logged in');
    setGradeModalCourse(course);
    try {
      const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
      const token = localStorage.getItem('accessToken');

      if (role === 'teacher' || role === 'admin') {
        // teacher view: fetch all assignment grades and course grades (teacher endpoints)
        const [assignRes, gradeRes] = await Promise.all([
          axios.get(`${base}/api/queries/assignment-grade/teacher`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${base}/api/queries/grade`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const allAssignGrades = assignRes.data || [];
        // assignment-grade read model populates assignmentId which may contain courseId
        const filteredAssign = allAssignGrades.filter(g => {
          const a = g.assignmentId || g.assignment || {};
          // flexible checks: assignment may embed courseId as number, string, or nested object
          const aCourseId = a?.courseId ?? a?.course ?? (a?.courseId?._id) ?? (a?.course?._id) ?? null;
          const gCourseId = g?.courseId ?? (g?.courseId?._id) ?? g?.course ?? null;
          return String(aCourseId) === String(course.courseId) || String(gCourseId) === String(course.courseId) || String(a?.assignmentId || a?._id || a?.id) === String(course.courseId);
        });
        setAssignmentGradesForCourse(filteredAssign);

        const allGrades = gradeRes.data || [];
        const filteredGrades = allGrades.filter(g => {
          const c = g.courseId || g.course || {};
          const cid = c?.courseId ?? c?._id ?? c?.id ?? null;
          return String(cid) === String(course.courseId) || String(g.courseId) === String(course.courseId) || String(g?.course) === String(course.courseId);
        });
        setCourseGradesForCourse(filteredGrades);

        // fetch assignments and exams for this course (read-model)
        let assignments = [];
        try {
          const [assignRes, examRes] = await Promise.all([
            axios.get(`${base}/api/queries/assignments`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${base}/api/queries/exams/course/${course.courseId}`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          const allAssigns = assignRes.data || [];
          assignments = allAssigns.filter(a => String(a.courseId) === String(course.courseId));
          setAssignmentsForCourse(assignments);
          const exams = examRes.data || [];
          setCourseExams(exams);

          // build assignmentPoints map
          const ptsMap = {};
          assignments.forEach(a => {
            const aid = a.assignmentId || a._id || a.id;
            ptsMap[aid] = a.points != null ? a.points : undefined;
          });
          setAssignmentPoints(ptsMap);

          // build examPoints map
          const epts = {};
          exams.forEach(ex => {
            const eid = ex.examId || ex._id || ex.id;
            epts[eid] = ex.points != null ? ex.points : undefined;
          });
          setExamPoints(epts);
        } catch (e) {
          console.error('Failed to fetch assignments/exams for grades matrix', e);
          setAssignmentsForCourse([]);
          setCourseExams([]);
          setAssignmentPoints({});
          setExamPoints({});
        }

        // build students list from populated student objects
        const studentsMap = {};
        const addStudentFrom = (s) => {
          if (!s) return;
          const key = s.studentId || s._id || s.id;
          if (!key) return;
          // normalize student object to include SQL id as 'studentId' so frontend can send it back
          studentsMap[key] = { _id: s._id || key, id: key, studentId: s.studentId || key, name: s.name, email: s.email };
        };
        filteredAssign.forEach(g => addStudentFrom(g.studentId || g.student));
        filteredGrades.forEach(g => addStudentFrom(g.studentId || g.student));
        setStudentsForCourse(Object.values(studentsMap));

        // prefill editingScores for teacher UI
        const editMap = {};
        filteredAssign.forEach(g => {
          const aid = g.assignmentId?.assignmentId || g.assignmentId?._id || g.assignmentId || g.assignment;
          const key = `a:${aid}`;
          editMap[key] = g.score != null ? g.score : '';
        });
        filteredGrades.forEach(g => {
          const cid = g.courseId?.courseId || g.courseId?._id || g.courseId || g.course;
          const key = `g:${cid}`;
          editMap[key] = g.score != null ? g.score : '';
        });
        setEditingScores(editMap);
      } else {
        // student view: fetch student's grades only
        const assignRes = await axios.get(`${base}/api/queries/assignment-grade/student/${user.id}`);
        const allAssignGrades = assignRes.data || [];
        setAssignmentGradesForCourse(allAssignGrades.filter(g => String(g.courseId) === String(course.courseId)));

        const gradeRes = await axios.get(`${base}/api/queries/grade/${user.id}`);
        const allGrades = gradeRes.data || [];
        setCourseGradesForCourse(allGrades.filter(g => String(g.courseId) === String(course.courseId)));
      }

      setGradeModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch grades', err.response?.data || err.message);
      alert('Failed to load grades');
    }
  };

  const saveAssignmentGrade = async (studentId, assignmentId, currentScore) => {
    const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
    const token = localStorage.getItem('accessToken');
    if (currentScore === '') return alert('Score required');
    const score = Number(currentScore);
    if (isNaN(score) || score < 0) return alert('Score must be >= 0');
    // validate against assignment max points if known
    const maxPoints = assignmentPoints[assignmentId] || assignmentPoints[assignmentId?.toString()];
    if (maxPoints != null && !isNaN(maxPoints) && score > Number(maxPoints)) return alert(`Score cannot exceed assignment max points (${maxPoints})`);
    try {
      // decide whether to POST (create) or PUT (update) based on existing read-model
      const exists = assignmentGradesForCourse.some(g => {
        const sid = g.studentId?.studentId || g.studentId?._id || g.studentId;
        const aid = g.assignmentId?.assignmentId || g.assignmentId?._id || g.assignmentId;
        return String(sid) === String(studentId) && String(aid) === String(assignmentId);
      });
      if (exists) {
        await axios.put(`${base}/api/commands/assignment-grade`, { studentId, assignmentId, score }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${base}/api/commands/assignment-grade`, { studentId, assignmentId, score }, { headers: { Authorization: `Bearer ${token}` } });
      }
      alert('Assignment grade saved');
      // refresh modal data
      openGradeModalForCourse(gradeModalCourse);
    } catch (err) {
      console.error('Save failed', err.response?.data || err.message);
      alert('Failed to save assignment grade');
    }
  };

  const saveCourseGrade = async (studentId, courseId, currentScore, examId = null) => {
    const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
    const token = localStorage.getItem('accessToken');
    if (currentScore === '') return alert('Score required');
    const score = Number(currentScore);
    if (isNaN(score) || score < 0 || score > 100) return alert('Score must be 0-100');
    try {
      // decide whether to create or update
      const exists = courseGradesForCourse.some(g => {
        const sid = g.studentId?.studentId || g.studentId?._id || g.studentId;
        const cid = g.courseId?.courseId || g.courseId?._id || g.courseId;
        return String(sid) === String(studentId) && String(cid) === String(courseId);
      });
      if (exists) {
        await axios.put(`${base}/api/commands/grade`, { studentId, courseId, score, examId }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${base}/api/commands/grade`, { studentId, courseId, score, examId }, { headers: { Authorization: `Bearer ${token}` } });
      }
      alert('Course/Exam grade saved');
      openGradeModalForCourse(gradeModalCourse);
    } catch (err) {
      console.error('Save failed', err.response?.data || err.message);
      alert('Failed to save course grade');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentId) return alert("Please select a department.");
    const payload = { title, departmentId };
    if (enrollmentKey) payload.enrollmentKey = enrollmentKey;
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/commands/courses/${editingId}`,
          payload
        );
        setEditingId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/commands/courses",
          payload
        );
      }
      setTitle("");
      setDepartmentId("");
      setEnrollmentKey("");
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.courseId);
    setTitle(course.title);
    setDepartmentId(course.departmentId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/commands/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  // --------- MODAL HANDLERS ----------
  const openCourseModal = (mode = "create", course = null) => {
    setMode(mode);
    setOpen(true);
    if (mode === "edit" && course) {
      setEditingId(course.courseId);
      setTitle(course.title);
      setDepartmentId(course.departmentId);
      setEnrollmentKey(course.enrollmentKey || "");
      const img = localStorage.getItem(`course_img_${course.courseId}`);
      setPreviewImage(img || null);
    } else {
      setEditingId(null);
      setTitle("");
      setDepartmentId("");
      setEnrollmentKey("");
      setPreviewImage(null);
    }
  };

  const closeCourseModal = () => {
    setOpen(false);
    setEditingId(null);
    setTitle("");
    setDepartmentId("");
    setEnrollmentKey("");
    setPreviewImage(null);
  };

  const submitCourseModal = (e) => {
    handleSubmit(e);
    closeCourseModal();
  };

  // --------- RENDER ----------
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Course Management
      </Typography>

      {/* Admin Inline Form */}
      {!teacherView && !studentView && (
        <>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              mb: 3,
              backgroundColor: "#f3e5f5",
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              size="small"
              sx={{ minWidth: 200, backgroundColor: "#fff" }}
            />
            <Select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              displayEmpty
              required
              size="small"
              sx={{ minWidth: 220, backgroundColor: "#fff" }}
            >
              <MenuItem value="">
                <em>-- Select Department --</em>
              </MenuItem>
              {departments.map((d) => (
                <MenuItem key={d.departmentId} value={d.departmentId}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Enrollment Key (optional)"
              value={enrollmentKey}
              onChange={(e) => setEnrollmentKey(e.target.value)}
              size="small"
              sx={{ minWidth: 200, backgroundColor: "#fff" }}
              helperText="Leave blank for open enrollment"
            />
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              size="medium"
              sx={{ height: 40, minWidth: 120 }}
            >
              {editingId ? "Update" : "Add"}
            </Button>
            {editingId && (
              <Button
                variant="outlined"
                color="inherit"
                size="medium"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setDepartmentId("");
                }}
              >
                Cancel
              </Button>
            )}
          </Box>

          {/* Admin Courses Table */}
          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f3e5f5" }}>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Department</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.courseId}>
                    <TableCell>{course.courseId}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      {departments.find(
                        (d) => d.departmentId === course.departmentId
                      )?.name || "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => handleEdit(course)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(course.courseId)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      {/* Teacher View */}
      {teacherView && !studentView && (
        <>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openCourseModal("create")}
            >
              Add Course
            </Button>
          </Box>
          <Grid container spacing={4}>
            {courses.map((course) => {
              const cardCourse = normalizeCourseForCard(course);
              return (
                <Grid item xs={12} sm={6} md={4} key={cardCourse.courseId}>
                  <CourseCard
                    course={cardCourse}
                    departments={departments}
                    role="teacher"
                    openModal={openCourseModal}
                    onDelete={handleDelete}
                  />
                  <Box mt={1} display="flex" justifyContent="flex-end">
                    <Button size="small" onClick={() => window.location.href = `/teachers/courses/${cardCourse.courseId}`}>
                      View Grades
                    </Button>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* Student View with visual separation */}
      {studentView && !isViewingCourse && (
        <>
          <Typography variant="h5" mt={6} gutterBottom>
            Enrolled Courses
          </Typography>
          <Grid container spacing={4}>
            {enrolledCourses.map((course) => {
              const cardCourse = normalizeCourseForCard(course);
              return (
                <Grid item xs={12} sm={6} md={4} key={cardCourse.courseId}>
                  <CourseCard
                    course={cardCourse}
                    departments={departments}
                    role="student"
                    isEnrolled={true}
                    onEnroll={handleEnrollClick}
                    onUnEnroll={unEnrollCourse}
                    onUpload={() => openUploadModalForCourse(cardCourse)}
                  />
                  <Box mt={1} display="flex" justifyContent="flex-end">
                    <Button size="small" onClick={() => window.location.href = `/students/courses/${cardCourse.courseId}`}>
                      View Grades
                    </Button>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Typography variant="h5" mt={6} gutterBottom>
            Available Courses
          </Typography>
          <Grid container spacing={4}>
            {availableCourses.map((course) => {
              const cardCourse = normalizeCourseForCard(course);
              return (
                <Grid item xs={12} sm={6} md={4} key={cardCourse.courseId}>
                  <CourseCard
                    course={cardCourse}
                    departments={departments}
                    role="student"
                    isEnrolled={false}
                    onEnroll={handleEnrollClick}
                    onUnEnroll={unEnrollCourse}
                    onUpload={() => openUploadModalForCourse(cardCourse)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* Course Modal */}
      {!studentView && (
        <CourseModal
          open={open}
          mode={mode}
          title={title}
          departmentId={departmentId}
          departments={departments || []}
          enrollmentKey={enrollmentKey}
          onChangeEnrollmentKey={setEnrollmentKey}
          onClose={closeCourseModal}
          onChangeTitle={setTitle}
          onChangeDept={setDepartmentId}
          onSubmit={submitCourseModal}
          onChangeImage={handleCourseImageUpload}
          previewImage={previewImage}
        />
      )}

      {/* Enrollment Key Modal */}
      {studentView && !isViewingCourse && (
        <Dialog open={keyModalOpen} onClose={() => setKeyModalOpen(false)}>
          <DialogTitle>Enter Enrollment Key</DialogTitle>
          <DialogContent>
            <TextField
              label="Enrollment Key"
              value={modalKey}
              onChange={(e) => setModalKey(e.target.value)}
              fullWidth
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setKeyModalOpen(false)}>Cancel</Button>
            <Button onClick={handleModalEnroll} variant="contained" color="primary">
              Enroll
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Student Course Upload Modal */}
      <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <DialogTitle>Upload file for {uploadCourse?.title || uploadCourse?.name || ''}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
            <Typography variant="subtitle1">Choose target</Typography>
            <Select
              value={selectedUploadAssignment}
              onChange={(e) => { setSelectedUploadAssignment(e.target.value); if (e.target.value) setSelectedUploadExam(''); }}
              displayEmpty
            >
              <MenuItem value=""><em>-- Select Assignment --</em></MenuItem>
              {courseAssignments.map(a => (
                <MenuItem key={a.assignmentId || a.id} value={a.assignmentId || a.id}>{a.title || a.name || `Assignment ${a.assignmentId || a.id}`}</MenuItem>
              ))}
            </Select>

            <Select
              value={selectedUploadExam}
              onChange={(e) => { setSelectedUploadExam(e.target.value); if (e.target.value) setSelectedUploadAssignment(''); }}
              displayEmpty
              disabled={role === 'student'}
              sx={ role === 'student' ? { backgroundColor: '#f5f5f5' } : {} }
            >
              <MenuItem value=""><em>-- Select Exam --</em></MenuItem>
              {courseExams.map(ex => (
                <MenuItem key={ex.examId || ex.id} value={ex.examId || ex.id}>{ex.title || ex.name || `Exam ${ex.examId || ex.id}`}</MenuItem>
              ))}
            </Select>
            {role === 'student' && (
              <Typography variant="caption" color="textSecondary">Students are not permitted to upload exam files. Choose an assignment instead.</Typography>
            )}

            <input type="file" onChange={(e) => setSelectedUploadFile(e.target.files?.[0] || null)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadModalOpen(false)}>Cancel</Button>
          <Button onClick={doCourseUpload} variant="contained" disabled={uploadingCourseFile}>Upload</Button>
        </DialogActions>
  </Dialog>
      {/* Grades Modal */}
      <Dialog open={gradeModalOpen} onClose={() => setGradeModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Grades for {gradeModalCourse?.title || gradeModalCourse?.name || ''}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Assignment Grade All + Listing */}
            <Typography variant="h6">Assignment Grades</Typography>
            {assignmentsForCourse.length === 0 ? (
              <Typography>No assignments for this course.</Typography>
            ) : (
              <>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Assignment</TableCell>
                      <TableCell>Due</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignmentsForCourse.map(a => {
                      const aid = a.assignmentId || a._id || a.id;
                      return (
                        <TableRow key={aid}>
                          <TableCell>{a.title || `Assignment ${aid}`}</TableCell>
                          <TableCell>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}</TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" onClick={() => {
                              const map = {};
                              studentsForCourse.forEach(s => {
                                const sid = s.studentId || s._id || s.id;
                                const existing = assignmentGradesForCourse.find(g => ((g.assignmentId?.assignmentId || g.assignmentId?._id || g.assignmentId) === aid) && ((g.studentId?.studentId || g.studentId?._id || g.studentId) === sid));
                                map[sid] = existing ? (existing.score != null ? existing.score : '') : '';
                              });
                              setAssignmentAllEditing(map);
                              setAssignmentToGradeAll(a);
                              setAssignmentAllGraderOpen(true);
                            }}>Grade All</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Assignment</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Score</TableCell>
                      { (role === 'teacher' || role === 'admin') && <TableCell>Action</TableCell> }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignmentGradesForCourse.map((g) => {
                      const student = g.studentId?.name || g.student?.name || (g.studentId && (g.studentId.name || 'Student'));
                      const assignment = (g.assignmentId && (g.assignmentId.title || g.assignmentId)) || g.assignmentTitle || `Assignment ${g.assignmentId || g.assignment}`;
                      const due = g.assignmentId?.dueDate || g.dueDate || '';
                      const key = `a:${g.assignmentId?._id || g.assignmentId || g.assignment}`;
                      return (
                        <TableRow key={g._id || g.id || `${g.studentId}-${g.assignmentId}`}>
                          <TableCell>{assignment}</TableCell>
                          <TableCell>{student}</TableCell>
                          <TableCell>{due ? new Date(due).toLocaleDateString() : '—'}</TableCell>
                          <TableCell>
                            { (role === 'teacher' || role === 'admin') ? (
                              <TextField size="small" value={editingScores[key] ?? (g.score != null ? g.score : '')}
                                onChange={(e) => setEditingScores(s => ({ ...s, [key]: e.target.value }))} sx={{ maxWidth: 100 }} />
                            ) : (
                              <Typography>{g.score != null ? g.score : '—'}</Typography>
                            ) }
                          </TableCell>
                          { (role === 'teacher' || role === 'admin') && (
                            <TableCell>
                              <Button size="small" variant="contained" onClick={() => saveAssignmentGrade(g.studentId?.studentId || g.studentId?._id || g.studentId || g.student, g.assignmentId?.assignmentId || g.assignmentId?._id || g.assignmentId || g.assignment, editingScores[key] ?? (g.score != null ? g.score : ''))}>Save</Button>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}

            {/* Exams: Grade All + Listing */}
            <Typography variant="h6">Course / Exam Grades</Typography>
            {courseExams.length === 0 ? (
              <Typography>No exams for this course.</Typography>
            ) : (
              <>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Exam</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courseExams.map(ex => {
                      const eid = ex.examId || ex._id || ex.id;
                      return (
                        <TableRow key={eid}>
                          <TableCell>{ex.title || `Exam ${eid}`}</TableCell>
                          <TableCell>{ex.date ? new Date(ex.date).toLocaleDateString() : '—'}</TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" onClick={() => {
                              const map = {};
                              studentsForCourse.forEach(s => {
                                const sid = s.studentId || s._id || s.id;
                                const existing = courseGradesForCourse.find(g => ((g.examId || g.exam) === eid) && ((g.studentId?.studentId || g.studentId?._id || g.studentId) === sid));
                                map[sid] = existing ? (existing.score != null ? existing.score : '') : '';
                              });
                              setExamAllEditing(map);
                              setExamToGradeAll(ex);
                              setExamAllGraderOpen(true);
                            }}>Grade All</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Score</TableCell>
                      { (role === 'teacher' || role === 'admin') && <TableCell>Action</TableCell> }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courseGradesForCourse.map((g) => {
                      const student = g.studentId?.name || g.student?.name || (g.studentId && (g.studentId.name || 'Student'));
                      const title = g.title || g.examTitle || (g.courseId?.title || g.courseId?.name) || `Grade ${g._id || g.id}`;
                      const key = `g:${g._id || g.id || (g.courseId?._id || g.courseId)}`;
                      return (
                        <TableRow key={g._id || g.id || `${g.studentId}-${title}`}>
                          <TableCell>{title}</TableCell>
                          <TableCell>{student}</TableCell>
                          <TableCell>
                            { (role === 'teacher' || role === 'admin') ? (
                              <TextField size="small" value={editingScores[key] ?? (g.score != null ? g.score : '')}
                                onChange={(e) => setEditingScores(s => ({ ...s, [key]: e.target.value }))} sx={{ maxWidth: 100 }} />
                            ) : (
                              <Typography>{g.score != null ? g.score : '—'}</Typography>
                            ) }
                          </TableCell>
                          { (role === 'teacher' || role === 'admin') && (
                            <TableCell>
                              <Button size="small" variant="contained" onClick={() => saveCourseGrade(g.studentId?.studentId || g.studentId?._id || g.studentId || g.student, g.courseId?.courseId || g.courseId?._id || g.courseId || g.courseId, editingScores[key] ?? (g.score != null ? g.score : ''), g.examId || null)}>Save</Button>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}

            {/* Students list with View Grades */}
            { (role === 'teacher' || role === 'admin') && (
              <>
                <Typography variant="h6">Students in this course</Typography>
                {studentsForCourse.length === 0 ? (
                  <Typography>No students found.</Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentsForCourse.map(s => (
                        <TableRow key={s._id || s.id}>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.email || '—'}</TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" onClick={() => { setStudentToGrade(s); setStudentGraderOpen(true); }}>View Grades</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </>
            )}

            {/* Assignment matrix and per-student dialog */}
            {assignmentsForCourse.length > 0 && studentsForCourse.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>Grade Matrix</Typography>
                <GradeMatrix
                  assignments={assignmentsForCourse}
                  students={studentsForCourse}
                  matrixEditing={matrixEditing}
                  setMatrixEditing={setMatrixEditing}
                  assignmentPoints={assignmentPoints}
                  onOpenStudentGrader={(s) => { setStudentToGrade(s); setStudentGraderOpen(true); }}
                  onSaveRow={async (s) => {
                    const sid = s.studentId || s._id || s.id;
                    for (const a of assignmentsForCourse) {
                      const aid = a.assignmentId || a._id || a.id;
                      const key = `${sid}:${aid}`;
                      const val = matrixEditing[key];
                      if (val !== undefined && val !== '') {
                        await saveAssignmentGrade(s.studentId || s.id || sid, aid, val);
                      }
                    }
                    alert('Row grades saved');
                  }}
                />

                <SingleStudentGradeDialog
                  open={studentGraderOpen}
                  student={studentToGrade}
                  assignments={assignmentsForCourse}
                  exams={courseExams}
                  matrixEditing={matrixEditing}
                  setMatrixEditing={setMatrixEditing}
                  assignmentPoints={assignmentPoints}
                  examPoints={examPoints}
                  onClose={() => setStudentGraderOpen(false)}
                  onSaveStudent={async (s) => {
                    const sid = s.studentId || s._id || s.id;
                    // save assignments
                    for (const a of assignmentsForCourse) {
                      const aid = a.assignmentId || a._id || a.id;
                      const key = `${sid}:${aid}`;
                      const val = matrixEditing[key];
                      if (val !== undefined && val !== '') {
                        await saveAssignmentGrade(s.studentId || s.id || sid, aid, val);
                      }
                    }
                    // save exams (use saveCourseGrade with examId)
                    for (const ex of courseExams) {
                      const eid = ex.examId || ex._id || ex.id;
                      const key = `ex:${sid}:${eid}`;
                      const val = matrixEditing[key];
                      if (val !== undefined && val !== '') {
                        await saveCourseGrade(s.studentId || s.id || sid, gradeModalCourse?.courseId || gradeModalCourse?.id, val, eid);
                      }
                    }
                    setStudentGraderOpen(false);
                    alert('Saved student grades');
                    openGradeModalForCourse(gradeModalCourse);
                  }}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assignment All grader dialog */}
      <Dialog open={assignmentAllGraderOpen} onClose={() => setAssignmentAllGraderOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Grade All: {assignmentToGradeAll?.title || assignmentToGradeAll?.assignmentId}</DialogTitle>
        <DialogContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentsForCourse.map(s => {
                const sid = s.studentId || s._id || s.id;
                const key = sid;
                return (
                  <TableRow key={sid}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>
                      <TextField size="small" type="number" value={assignmentAllEditing[key] ?? ''} onChange={(e) => setAssignmentAllEditing(m => ({ ...m, [key]: e.target.value }))} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignmentAllGraderOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            // save all
            const aid = assignmentToGradeAll?.assignmentId || assignmentToGradeAll?._id || assignmentToGradeAll?.id;
            for (const sid of Object.keys(assignmentAllEditing)) {
              const val = assignmentAllEditing[sid];
              if (val !== undefined && val !== '') await saveAssignmentGrade(sid, aid, val);
            }
            setAssignmentAllGraderOpen(false);
            openGradeModalForCourse(gradeModalCourse);
          }}>Save All</Button>
        </DialogActions>
      </Dialog>

      {/* Exam All grader dialog */}
      <Dialog open={examAllGraderOpen} onClose={() => setExamAllGraderOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Grade All: {examToGradeAll?.title || examToGradeAll?.examId}</DialogTitle>
        <DialogContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentsForCourse.map(s => {
                const sid = s.studentId || s._id || s.id;
                const key = sid;
                return (
                  <TableRow key={sid}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>
                      <TextField size="small" type="number" value={examAllEditing[key] ?? ''} onChange={(e) => setExamAllEditing(m => ({ ...m, [key]: e.target.value }))} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExamAllGraderOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            const eid = examToGradeAll?.examId || examToGradeAll?._id || examToGradeAll?.id;
            for (const sid of Object.keys(examAllEditing)) {
              const val = examAllEditing[sid];
              if (val !== undefined && val !== '') await saveCourseGrade(sid, gradeModalCourse?.courseId || gradeModalCourse?.id, val, eid);
            }
            setExamAllGraderOpen(false);
            openGradeModalForCourse(gradeModalCourse);
          }}>Save All</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
