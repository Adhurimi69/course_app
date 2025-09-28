// src/Views/CourseLayout.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography, Divider, Link } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import LectureModal from "../components/LectureModal";
import AssignmentModal from "../components/AssignmentModal";
import ExamModal from "../components/ExamModal";

export default function CourseLayout({ studentView = false }) {
  const { courseId } = useParams();
  const studentId = JSON.parse(localStorage.getItem("user"))?.id;

  const [lectures, setLectures] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState({});

  const [openLectureModal, setOpenLectureModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);

  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [currentLectureId, setCurrentLectureId] = useState(null);

  const [openExamModal, setOpenExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const handleSelectFile = (type, id, file) => {
    setSelectedFiles((prev) => ({ ...prev, [`${type}-${id}`]: file }));
  };

  const handleUpload = async (type, id) => {
    if (!id) return alert("Invalid ID. Please save the lecture/assignment first.");
    const key = `${type}-${id}`;
    const file = selectedFiles[key];
    if (!file) return alert("Choose a file first.");

    const fd = new FormData();
    fd.append("file", file);
    if (type === "assignment") {
      if (!studentId) return alert("Not logged in.");
      fd.append("assignmentId", id);
      fd.append("studentId", studentId);
    } else if (type === "lecture") {
      fd.append("lectureId", id);
    }

    try {
      setUploading((prev) => ({ ...prev, [key]: true }));
      await axios.post("http://localhost:5000/api/commands/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload successful!");
      await fetchData();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Upload failed.");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const fetchData = async () => {
  setLoading(true);
  try {
    // 1) Fetch lectures
    const lecRes = await axios.get(
      `http://localhost:5000/api/queries/lectures/course/${courseId}`
    );
    const lecturesData = lecRes.data;

    // 2) Fetch assignments for all lectures
    const assignmentsPromises = lecturesData.map((lec) =>
      axios
        .get(`http://localhost:5000/api/queries/assignments/lecture/${lec.lectureId}`)
        .then((res) => res.data || [])
        .catch((err) => {
          console.error("Assignments fetch failed for lecture", lec.lectureId, err);
          return [];
        })
    );
    const assignmentsData = await Promise.all(assignmentsPromises);

    // 3) Fetch all uploads for the course at once
    const uploadsRes = await axios.get(
      `http://localhost:5000/api/queries/uploads/course/${courseId}`
    );
    const allUploads = uploadsRes.data || [];

    // 4) Map uploads to lectures and assignments
    const lecturesWithAssignments = lecturesData.map((lec, i) => {
      const lectureUploads = allUploads.filter((u) => u.lectureId === lec.lectureId);
      const assignments = assignmentsData[i].map((a) => {
        const assignmentUploads = allUploads.filter((u) => u.assignmentId === a.assignmentId);
        return { ...a, uploads: assignmentUploads };
      });
      return { ...lec, assignments, uploads: lectureUploads };
    });

    setLectures(lecturesWithAssignments);

    // 5) Fetch exams
    const examRes = await axios.get(
      `http://localhost:5000/api/queries/exams/course/${courseId}`
    );
    setExams(examRes.data || []);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Lecture/Assignment/Exam handlers (unchanged)
  const handleLectureSave = async () => { setOpenLectureModal(false); setEditingLecture(null); await fetchData(); };
  const handleLectureDelete = async (id) => { if (!window.confirm("Delete this lecture?")) return; await axios.delete(`http://localhost:5000/api/commands/lectures/${id}`); await fetchData(); };
  const handleAssignmentSave = async () => { setOpenAssignmentModal(false); setEditingAssignment(null); await fetchData(); };
  const handleAssignmentDelete = async (id) => { if (!window.confirm("Delete this assignment?")) return; await axios.delete(`http://localhost:5000/api/commands/assignments/${id}`); await fetchData(); };
  const handleExamSave = async () => { setOpenExamModal(false); setEditingExam(null); await fetchData(); };
  const handleExamDelete = async (id) => { if (!window.confirm("Delete this exam?")) return; await axios.delete(`http://localhost:5000/api/commands/exams/${id}`); await fetchData(); };

  return (
    <>
      <Box sx={{ display: "flex", height: "100%", gap: 2 }}>
        {/* Lectures & Assignments */}
        <Box sx={{ flex: 2, p: 3, overflowY: "auto" }}>
          <Typography variant="h5" gutterBottom>Lectures &amp; Assignments</Typography>

          {lectures.map((lec) => (
            <Box key={lec.lectureId} sx={{ mb: 4 }}>
              <Box sx={{ border: "1px solid #ddd", backgroundColor: "white", borderRadius: 1, p: 2 }}>
                <Typography variant="h6">{lec.title}</Typography>

                {/* Edit/Delete Lecture */}
                {!studentView && (
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button size="small" onClick={() => { setEditingLecture(lec); setOpenLectureModal(true); }}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleLectureDelete(lec.lectureId)}>Delete</Button>
                  </Box>
                )}

                {/* Lecture Uploads */}
{lec.uploads?.length > 0 && (
  <Box sx={{ mt: 1 }}>
    <Typography variant="subtitle2">Lecture Files:</Typography>
    {lec.uploads.map((u) =>
      u.file ? (
        <Link
          key={u.id}
          href={`http://localhost:5000/uploads/misc/${u.file}`}
          target="_blank"
          underline="hover"
          download
        >
          {u.file} {u.timeUploaded && `(${new Date(u.timeUploaded).toLocaleString()})`}
        </Link>
      ) : null
    )}
  </Box>
)}


                {/* Upload lecture file (teachers only) */}
                {!studentView && (
                  <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center", flexWrap: "wrap" }}>
                    <Button variant="outlined" size="small" component="label">
                      Choose file
                      <input type="file" hidden onChange={(e) => handleSelectFile("lecture", lec.lectureId, e.target.files?.[0])} />
                    </Button>
                    <Typography variant="caption">{selectedFiles[`lecture-${lec.lectureId}`]?.name || "No file chosen"}</Typography>
                    <Button variant="contained" size="small" disabled={!!uploading[`lecture-${lec.lectureId}`]} onClick={() => handleUpload("lecture", lec.lectureId)}>
                      {uploading[`lecture-${lec.lectureId}`] ? "Uploading..." : "Upload"}
                    </Button>
                  </Box>
                )}

                {/* Assignments */}
                {lec.assignments.map((a) => {
                  const due = a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "—";
                  return (
                    <Box key={a.assignmentId} sx={{ border: "1px solid #ccc", borderRadius: 1, p: 1, mt: 2 }}>
                      <Typography>{a.title}</Typography>
                      <Typography variant="caption" color="textSecondary">Due: {due}</Typography>

                      {/* Assignment Uploads */}
{a.uploads?.length > 0 && (
  <Box sx={{ mt: 1 }}>
    <Typography variant="subtitle2">Submitted Files:</Typography>
    {a.uploads.map((u) =>
      u.file ? (
        <Link
          key={u.id}
          href={`http://localhost:5000/uploads/misc/${u.file}`}
          target="_blank"
          underline="hover"
          download
        >
          {u.file} {u.timeUploaded && `(${new Date(u.timeUploaded).toLocaleString()})`}
          {u.student && ` — ${u.student.name}`}
        </Link>
      ) : null
    )}
  </Box>
)}

                      {/* Edit/Delete Assignment */}
                      {!studentView && (
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <Button size="small" onClick={() => { setCurrentLectureId(lec.lectureId); setEditingAssignment(a); setOpenAssignmentModal(true); }}>Edit</Button>
                          <Button size="small" color="error" onClick={() => handleAssignmentDelete(a.assignmentId)}>Delete</Button>
                        </Box>
                      )}

                      {/* Student upload */}
                      {studentView && (
                        <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center", flexWrap: "wrap" }}>
                          <Button variant="outlined" size="small" component="label">
                            Choose file
                            <input type="file" hidden onChange={(e) => handleSelectFile("assignment", a.assignmentId, e.target.files?.[0])} />
                          </Button>
                          <Typography variant="caption">{selectedFiles[`assignment-${a.assignmentId}`]?.name || "No file chosen"}</Typography>
                          <Button variant="contained" size="small" disabled={!!uploading[`assignment-${a.assignmentId}`]} onClick={() => handleUpload("assignment", a.assignmentId)}>
                            {uploading[`assignment-${a.assignmentId}`] ? "Uploading..." : "Upload"}
                          </Button>
                        </Box>
                      )}
                    </Box>
                  );
                })}

                {/* Add Assignment */}
                {!studentView && (
                  <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => { setCurrentLectureId(lec.lectureId); setEditingAssignment(null); setOpenAssignmentModal(true); }}>
                    Add Assignment
                  </Button>
                )}
              </Box>
            </Box>
          ))}

          {/* Add Lecture */}
          {!studentView && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingLecture(null); setOpenLectureModal(true); }}>
              Add Lecture
            </Button>
          )}
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Exams */}
        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
          <Typography variant="h5" gutterBottom>Exams</Typography>
          {exams.map((e) => (
            <Box key={e.examId} sx={{ border: "1px solid #ddd", backgroundColor: "white", borderRadius: 1, p: 2, mb: 2 }}>
              <Typography>{e.title}</Typography>
              <Typography variant="caption" color="textSecondary">Date: {e.date ? new Date(e.date).toLocaleDateString() : "—"}</Typography>

              {!studentView && (
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button size="small" onClick={() => { setEditingExam(e); setOpenExamModal(true); }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleExamDelete(e.examId)}>Delete</Button>
                </Box>
              )}
            </Box>
          ))}

          {!studentView && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingExam(null); setOpenExamModal(true); }}>
              Add Exam
            </Button>
          )}
        </Box>
      </Box>

      {/* Modals */}
      {!studentView && (
        <>
          <LectureModal open={openLectureModal} courseId={courseId} lecture={editingLecture} onClose={() => setOpenLectureModal(false)} onSave={handleLectureSave} />
          <AssignmentModal open={openAssignmentModal} lectureId={currentLectureId} assignment={editingAssignment} onClose={() => setOpenAssignmentModal(false)} onSave={handleAssignmentSave} />
          <ExamModal open={openExamModal} courseId={courseId} exam={editingExam} onClose={() => setOpenExamModal(false)} onSave={handleExamSave} />
        </>
      )}
    </>
  );
}
