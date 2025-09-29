import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [lectures, setLectures] = useState([]);
  const parsedUser = JSON.parse(localStorage.getItem('user') || 'null') || {};
  const currentUser = parsedUser;
  const currentRole = localStorage.getItem('role') || parsedUser?.role;

  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState({});
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState("");
  const [lectureId, setLectureId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAssignments();
    fetchLectures();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/assignments");
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const fetchLectures = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries/lectures");
      setLectures(res.data);
    } catch (err) {
      console.error("Error fetching lectures:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lectureId) return alert("Please select a lecture.");

    const data = { title, dueDate, lectureId, points: points !== "" ? Number(points) : null };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/commands/assignments/${editingId}`, data);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/commands/assignments", data);
      }
      setTitle("");
      setDueDate("");
      setLectureId("");
      fetchAssignments();
    } catch (err) {
      console.error("Error submitting assignment:", err);
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment.assignmentId);
    setTitle(assignment.title);
    setDueDate(assignment.dueDate ? assignment.dueDate.slice(0, 10) : "");
    setPoints(assignment.points != null ? String(assignment.points) : "");
    setLectureId(assignment.lectureId || "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/commands/assignments/${id}`);
        fetchAssignments();
      } catch (err) {
        console.error("Error deleting assignment:", err);
      }
    }
  };

  const handleSelectFile = (assignmentId, file) => {
    setSelectedFiles((prev) => ({ ...prev, [assignmentId]: file }));
  };

  const handleUpload = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) return alert('Choose a file first');
    const token = localStorage.getItem('accessToken');
    if (!token) return alert('You must be logged in to upload');

    const fd = new FormData();
    // append metadata before file so multer destination sees it
    fd.append('assignmentId', assignmentId);
    if (currentRole === 'student') fd.append('studentId', currentUser.id);
    fd.append('file', file);

    try {
      setUploading((s) => ({ ...s, [assignmentId]: true }));
      const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
      await axios.post(`${base}/api/commands/upload`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Upload successful');
      // refresh assignments if needed
      fetchAssignments();
    } catch (err) {
      console.error('Upload failed', err.response?.data || err.message);
      alert('Upload failed');
    } finally {
      setUploading((s) => ({ ...s, [assignmentId]: false }));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Assignment Management
      </Typography>

      <Box
  component="form"
  onSubmit={handleSubmit}
  sx={{
    display: "flex",
    gap: 2,
    alignItems: "center",
    mb: 3,
    backgroundColor: "#f3e5f5",
    padding: 2,
    borderRadius: 2,
    boxShadow: 1,
    flexWrap: "wrap",
  }}
>
  <TextField
    label="Assignment Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    size="small"
    sx={{ minWidth: 180, backgroundColor: "#fff" }}
  />
  <TextField
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    label="Due Date"
    InputLabelProps={{ shrink: true }}
    size="small"
    sx={{ minWidth: 160, backgroundColor: "#fff" }}
  />
  <TextField
    label="Points"
    type="number"
    value={points}
    onChange={(e) => setPoints(e.target.value)}
    size="small"
    sx={{ minWidth: 120, backgroundColor: "#fff" }}
    InputProps={{ inputProps: { min: 0 } }}
    helperText="Optional"
  />
  <Select
    value={lectureId}
    onChange={(e) => setLectureId(e.target.value)}
    displayEmpty
    required
    size="small"
    sx={{ minWidth: 220, backgroundColor: "#fff" }}
  >
    <MenuItem value="">
      <em>-- Select Lecture --</em>
    </MenuItem>
    {lectures.map((lecture) => (
      <MenuItem key={lecture.lectureId} value={lecture.lectureId}>
        {lecture.title}
      </MenuItem>
    ))}
  </Select>
  <Button
    variant="contained"
    color="secondary"
    type="submit"
    size="medium"
    sx={{ height: "40px", minWidth: "120px" }}
  >
    {editingId ? "Update" : "Add"}
  </Button>
  {editingId && (
    <Button
      variant="outlined"
      color="inherit"
      onClick={() => {
        setEditingId(null);
        setTitle("");
        setDueDate("");
        setLectureId("");
      }}
    >
      Cancel
    </Button>
  )}
</Box>


      <Paper elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f3e5f5" }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Lecture</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a.assignmentId}>
                <TableCell>{a.assignmentId}</TableCell>
                <TableCell>{a.title}</TableCell>
                <TableCell>{lectures.find((l) => l.lectureId === a.lectureId)?.title || "N/A"}</TableCell>
                <TableCell>{a.dueDate ? a.dueDate.slice(0, 10) : "No due date"}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(a)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(a.assignmentId)}
                  >
                    Delete
                  </Button>
                  {/* Student upload UI */}
                  {currentRole === 'student' && (
                    <div style={{ display: 'inline-flex', gap: 8, marginLeft: 12, alignItems: 'center' }}>
                      <input type="file" id={`file-${a.assignmentId}`} style={{ display: 'none' }} onChange={(e) => handleSelectFile(a.assignmentId, e.target.files?.[0])} />
                      <label htmlFor={`file-${a.assignmentId}`}>
                        <Button size="small" variant="outlined" component="span">Choose</Button>
                      </label>
                      <span style={{ fontSize: 12 }}>{selectedFiles[a.assignmentId]?.name || 'No file chosen'}</span>
                      <Button size="small" variant="contained" onClick={() => handleUpload(a.assignmentId)} disabled={!!uploading[a.assignmentId]}>Upload</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
