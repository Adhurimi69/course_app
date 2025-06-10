// src/Views/CourseLayout.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LectureModal from "../components/LectureModal";

/**
 * Layout for a single course detail view.
 * Fetches and displays all lectures, assignments, and exams from the database.
 * Integrates AddLectureModal to create new lectures.
 */
export default function CourseLayout() {
  const { courseId } = useParams();

  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openAddLecture, setOpenAddLecture] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [lecRes, asgRes, exRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/queries/lectures/course/${courseId}`
          ),
          axios.get(
            `http://localhost:5000/api/queries/assignments?courseId=${courseId}`
          ),
          axios.get(
            `http://localhost:5000/api/queries/exams?courseId=${courseId}`
          ),
        ]);
        setLectures(lecRes.data);
        setAssignments(asgRes.data);
        setExams(exRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [courseId]);

  const handleAddLecture = () => {
    setOpenAddLecture(true);
  };

  const handleLectureAdded = (newLecture) => {
    setLectures((prev) => [...prev, newLecture]);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Box sx={{ display: "flex", height: "100%", gap: 2 }}>
        {/* Left column: Lectures */}
        <Box sx={{ flex: 2, p: 3, overflowY: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Lectures
          </Typography>
          {lectures.map((lec) => (
            <Box
              key={lec.lectureId}
              sx={{ border: "1px solid #ddd", borderRadius: 1, p: 2, mb: 2 }}
            >
              <Typography variant="body1">{lec.title}</Typography>
              <Typography variant="caption" color="textSecondary">
                {lec.description}
              </Typography>
            </Box>
          ))}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={handleAddLecture}
          >
            Add Lecture
          </Button>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Right column: Assignments & Exams */}
        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Assignments
            </Typography>
            {assignments.map((asg) => (
              <Box
                key={asg.assignmentId}
                sx={{ border: "1px solid #ddd", borderRadius: 1, p: 2, mb: 2 }}
              >
                <Typography variant="body1">{asg.title}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Due: {new Date(asg.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                /* TODO: add assignment */
              }}
            >
              Add Assignment
            </Button>
          </Box>

          <Divider />

          <Box sx={{ mt: 4 }}>
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
              onClick={() => {
                /* TODO: add exam */
              }}
            >
              Add Exam
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Add Lecture Modal */}
      <LectureModal
        open={openAddLecture}
        courseId={courseId}
        onClose={() => setOpenAddLecture(false)}
        onLectureAdded={handleLectureAdded}
      />
    </>
  );
}
