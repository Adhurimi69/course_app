import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
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
  const [selectedImageCourseId, setSelectedImageCourseId] = useState(null);
  const [pendingImageBase64, setPendingImageBase64] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Admin inline form states
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [enrollmentKey, setEnrollmentKey] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");

  // Track key input per course
  const [keyInputs, setKeyInputs] = useState({});
  // Modal state for key entry
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [modalCourseId, setModalCourseId] = useState(null);
  const [modalKey, setModalKey] = useState("");

  useEffect(() => {
    fetchDepartments();
    if (studentView) {
      fetchStudentCourses();
    } else {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const unEnrollCourse = async (courseId) => {
    try {
      await axios.delete("http://localhost:5000/api/commands/student-courses", {
        data: { studentId, courseId }
      });
      fetchStudentCourses();
    } catch (err) {
      console.error("Unenrollment failed:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentCourses = async () => {
    try {
      const enrolledRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/enrolled/${studentId}`
      );
      setEnrolledCourses(enrolledRes.data);
      const availableRes = await axios.get(
        `http://localhost:5000/api/commands/student-courses/available/${studentId}`
      );
      setAvailableCourses(availableRes.data);
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
        localStorage.setItem(`course_img_${selectedImageCourseId}`, reader.result);
      } else {
        setPendingImageBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const enrollCourse = async (courseId, key = "") => {
    try {
      await axios.post("http://localhost:5000/api/commands/student-courses", {
        studentId,
        courseId,
        key
      });
      fetchStudentCourses();
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  const handleEnrollClick = (course) => {
    const courseId = course.courseId || course.id;
    if (course.hasEnrollmentKey) {
      setModalCourseId(courseId);
      setModalKey("");
      setKeyModalOpen(true);
    } else {
      enrollCourse(courseId);
    }
  };

  const handleModalEnroll = () => {
    enrollCourse(modalCourseId, modalKey);
    setKeyModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentId) return alert("Please select a department.");
    const payload = { title, departmentId };
    if (enrollmentKey) payload.enrollmentKey = enrollmentKey;
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/commands/courses/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/courses", payload);
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
            onChange={e => setEnrollmentKey(e.target.value)}
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
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.courseId}>
                  <TableCell>{course.courseId}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    {departments.find((d) => d.departmentId === course.departmentId)?.name || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => handleEdit(course)} sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(course.courseId)}>
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
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => openCourseModal("create")}>
            Add Course
          </Button>
        </Box>
        <Grid container spacing={4}>
          {courses.map(course => {
            const courseId = course.courseId || course.id;
            return (
              <Grid item xs={12} sm={6} md={4} key={courseId}>
                <CourseCard
                  course={{ ...course, imageUrl: localStorage.getItem(`course_img_${courseId}`) || null }}
                  departments={departments}
                  role="teacher"
                  openModal={openCourseModal}
                  onDelete={handleDelete}
                />
              </Grid>
            );
          })}
        </Grid>
      </>
    )}

    {/* Student View with visual separation */}
{studentView && !isViewingCourse && (
  <>
    <Typography variant="h5" mt={6} gutterBottom>Enrolled Courses</Typography>
    <Grid container spacing={4}>
      {enrolledCourses.map(course => {
        const courseId = course.courseId || course.id;
        return (
          <Grid item xs={12} sm={6} md={4} key={courseId}>
            <CourseCard
              course={{ ...course, imageUrl: localStorage.getItem(`course_img_${courseId}`) || null }}
              departments={departments}
              role="student"
              isEnrolled={true} // 👈 shenon qe eshte enrolled
              onEnroll={handleEnrollClick} // nuk do te shfaqet sepse isEnrolled=true
              onUnEnroll={unEnrollCourse} // 👈 Unenroll button funksional
            />
          </Grid>
        );
      })}
    </Grid>

    <Typography variant="h5" mt={6} gutterBottom>Available Courses</Typography>
    <Grid container spacing={4}>
      {availableCourses.map(course => {
        const courseId = course.courseId || course.id;
        return (
          <Grid item xs={12} sm={6} md={4} key={courseId}>
            <CourseCard
              course={{ ...course, imageUrl: localStorage.getItem(`course_img_${courseId}`) || null }}
              departments={departments}
              role="student"
              isEnrolled={false} // 👈 shenon qe nuk eshte enrolled
              onEnroll={handleEnrollClick} // 👈 Enroll button funksional
              onUnEnroll={unEnrollCourse} // nuk shfaqet sepse isEnrolled=false
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
            onChange={e => setModalKey(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKeyModalOpen(false)}>Cancel</Button>
          <Button onClick={handleModalEnroll} variant="contained" color="primary">Enroll</Button>
        </DialogActions>
      </Dialog>
    )}

  </Box>
);

}
