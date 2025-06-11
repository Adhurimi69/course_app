// src/Views/CourseLayout.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LectureModal from "../components/LectureModal";
import AssignmentModal from "../components/AssignmentModal";
import ExamModal from "../components/ExamModal";

export default function CourseLayout() {
  const { courseId } = useParams();

  const [lectures, setLectures] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [openAddLecture, setOpenAddLecture] = useState(false);
  const [openAddAssignment, setOpenAddAssignment] = useState(false);
  const [openAddExam, setOpenAddExam] = useState(false);
  const [currentLectureId, setCurrentLectureId] = useState(null);

  // Fetch lectures and exams
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [lecRes, examRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/queries/lectures/course/${courseId}`
          ),
          axios.get(
            `http://localhost:5000/api/queries/exams?courseId=${courseId}`
          ),
        ]);
        setLectures(lecRes.data);
        setExams(examRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [courseId]);

  const handleLectureAdded = (newLecture) => {
    setLectures((prev) => [...prev, newLecture]);
  };

  const handleAssignmentAdded = (newAssignment) => {
    setLectures((prev) =>
      prev.map((lec) =>
        lec.lectureId === newAssignment.lectureId
          ? { ...lec, assignments: [...(lec.assignments || []), newAssignment] }
          : lec
      )
    );
  };

  const handleExamAdded = (newExam) => {
    setExams((prev) => [...prev, newExam]);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Box sx={{ display: "flex", height: "100%", gap: 2 }}>
        {/* Left column: Lectures and Assignments */}
        <Box sx={{ flex: 2, p: 3, overflowY: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Lectures & Assignments
          </Typography>

          {lectures.map((lec) => (
            <Box key={lec.lectureId} sx={{ mb: 4 }}>
              <Box sx={{ border: "1px solid #ddd", borderRadius: 1, p: 2 }}>
                <Typography variant="h6">{lec.title}</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  {lec.description}
                </Typography>
                {/* Assignment list under lecture */}
                {(lec.assignments || []).map((asg) => (
                  <Box
                    key={asg.assignmentId}
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      p: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">{asg.title}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Due: {new Date(asg.dueDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setCurrentLectureId(lec.lectureId);
                    setOpenAddAssignment(true);
                  }}
                >
                  Add Assignment
                </Button>
              </Box>
            </Box>
          ))}
          {/* Add Lecture Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddLecture(true)}
          >
            Add Lecture
          </Button>
        </Box>

        {/* Divider */}
        <Divider orientation="vertical" flexItem />

        {/* Right column: Exams */}
        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Exams
          </Typography>
          {exams.map((ex) => (
            <Box
              key={ex.examId}
              sx={{ border: "1px solid #ddd", borderRadius: 1, p: 2, mb: 2 }}
            >
              <Typography variant="body1">{ex.title}</Typography>
              <Typography variant="caption" color="textSecondary">
                Date: {new Date(ex.date).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddExam(true)}
          >
            Add Exam
          </Button>
        </Box>
      </Box>

      {/* Modals */}
      <LectureModal
        open={openAddLecture}
        courseId={courseId}
        onClose={() => setOpenAddLecture(false)}
        onLectureAdded={handleLectureAdded}
      />

      <AssignmentModal
        open={openAddAssignment}
        lectureId={currentLectureId}
        onClose={() => setOpenAddAssignment(false)}
        onAssignmentAdded={handleAssignmentAdded}
      />

      <ExamModal
        open={openAddExam}
        courseId={courseId}
        onClose={() => setOpenAddExam(false)}
        onExamAdded={handleExamAdded}
      />
    </>
  );
}
