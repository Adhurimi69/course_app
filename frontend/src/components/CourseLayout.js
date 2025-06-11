// src/Views/CourseLayout.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import LectureModal from "../components/LectureModal";
import AssignmentModal from "../components/AssignmentModal";
import ExamModal from "../components/ExamModal";

export default function CourseLayout({ studentView = false }) {
  const { courseId } = useParams();

  const [lectures, setLectures] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lecture modal state
  const [openLectureModal, setOpenLectureModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);

  // Assignment modal state
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [currentLectureId, setCurrentLectureId] = useState(null);

  // Exam modal state
  const [openExamModal, setOpenExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  // Fetch all data (lectures with assignments, and exams)
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1) Fetch lectures
      const lecRes = await axios.get(
        `http://localhost:5000/api/queries/lectures/course/${courseId}`
      );
      const lecturesData = lecRes.data;

      // 2) Append assignments to each lecture
      const lecturesWithAssignments = await Promise.all(
        lecturesData.map(async (lec) => {
          const asgRes = await axios.get(
            `http://localhost:5000/api/queries/assignments/lecture/${lec.lectureId}`
          );
          return { ...lec, assignments: asgRes.data };
        })
      );
      setLectures(lecturesWithAssignments);

      // 3) Fetch exams
      const examRes = await axios.get(
        `http://localhost:5000/api/queries/exams/course/${courseId}`
      );
      setExams(examRes.data);

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Lecture handlers
  const handleLectureSave = async () => {
    setOpenLectureModal(false);
    setEditingLecture(null);
    await fetchData();
  };
  const handleLectureDelete = async (id) => {
    if (!window.confirm("Delete this lecture?")) return;
    await axios.delete(`http://localhost:5000/api/commands/lectures/${id}`);
    await fetchData();
  };

  // Assignment handlers
  const handleAssignmentSave = async () => {
    setOpenAssignmentModal(false);
    setEditingAssignment(null);
    await fetchData();
  };
  const handleAssignmentDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    await axios.delete(`http://localhost:5000/api/commands/assignments/${id}`);
    await fetchData();
  };

  // Exam handlers
  const handleExamSave = async () => {
    setOpenExamModal(false);
    setEditingExam(null);
    await fetchData();
  };
  const handleExamDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    await axios.delete(`http://localhost:5000/api/commands/exams/${id}`);
    await fetchData();
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "100%", gap: 2 }}>
        {/* Lectures & Assignments */}
        <Box sx={{ flex: 2, p: 3, overflowY: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Lectures & Assignments
          </Typography>

          {lectures.map((lec) => (
            <Box key={lec.lectureId} sx={{ mb: 4 }}>
              <Box sx={{ border: "1px solid #ddd", borderRadius: 1, p: 2 }}>
                <Typography variant="h6">{lec.title}</Typography>

                {/* Edit/Delete Lecture (teachers only) */}
                {!studentView && (
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditingLecture(lec);
                        setOpenLectureModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleLectureDelete(lec.lectureId)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}

                {/* Assignments */}
                {lec.assignments.map((a) => (
                  <Box
                    key={a.assignmentId}
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      p: 1,
                      mt: 2,
                    }}
                  >
                    <Typography>{a.title}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Due: {new Date(a.dueDate).toLocaleDateString()}
                    </Typography>

                    {/* Edit/Delete Assignment (teachers only) */}
                    {!studentView && (
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Button
                          size="small"
                          onClick={() => {
                            setCurrentLectureId(lec.lectureId);
                            setEditingAssignment(a);
                            setOpenAssignmentModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleAssignmentDelete(a.assignmentId)}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))}

                {/* Add Assignment (teachers only) */}
                {!studentView && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setCurrentLectureId(lec.lectureId);
                      setEditingAssignment(null);
                      setOpenAssignmentModal(true);
                    }}
                  >
                    Add Assignment
                  </Button>
                )}
              </Box>
            </Box>
          ))}

          {/* Add Lecture (teachers only) */}
          {!studentView && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingLecture(null);
                setOpenLectureModal(true);
              }}
            >
              Add Lecture
            </Button>
          )}
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Exams */}
        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
          <Typography variant="h5" gutterBottom>
            Exams
          </Typography>

          {exams.map((e) => (
            <Box
              key={e.examId}
              sx={{ border: "1px solid #ddd", borderRadius: 1, p: 2, mb: 2 }}
            >
              <Typography>{e.title}</Typography>
              <Typography variant="caption" color="textSecondary">
                Date: {new Date(e.date).toLocaleDateString()}
              </Typography>

              {/* Edit/Delete Exam (teachers only) */}
              {!studentView && (
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditingExam(e);
                      setOpenExamModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleExamDelete(e.examId)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          ))}

          {/* Add Exam (teachers only) */}
          {!studentView && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingExam(null);
                setOpenExamModal(true);
              }}
            >
              Add Exam
            </Button>
          )}
        </Box>
      </Box>

      {/* Modals (teachers only) */}
      {!studentView && (
        <>
          <LectureModal
            open={openLectureModal}
            courseId={courseId}
            lecture={editingLecture}
            onClose={() => setOpenLectureModal(false)}
            onSave={handleLectureSave}
          />

          <AssignmentModal
            open={openAssignmentModal}
            lectureId={currentLectureId}
            assignment={editingAssignment}
            onClose={() => setOpenAssignmentModal(false)}
            onSave={handleAssignmentSave}
          />

          <ExamModal
            open={openExamModal}
            courseId={courseId}
            exam={editingExam}
            onClose={() => setOpenExamModal(false)}
            onSave={handleExamSave}
          />
        </>
      )}
    </>
  );
}
