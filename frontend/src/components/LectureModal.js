import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
} from "@mui/material";

/**
 * Props:
 * - open: boolean
 * - courseId: string
 * - lecture: { lectureId, title } | null
 * - onClose: () => void
 * - onSave: () => void
 */
export default function LectureModal({ open, courseId, lecture, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // File state (like CourseLayout: keyed by lectureId)
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Prefill when editing
  useEffect(() => {
    if (lecture) setTitle(lecture.title);
    else setTitle("");

    setError(null);
    setSelectedFile(null);
  }, [lecture]);

  // ✅ Separate upload function
  const handleUpload = async (file, lectureId) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("lectureId", lectureId);

    try {
      setUploading(true);
      await axios.post("http://localhost:5000/api/commands/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Lecture file uploaded!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Lecture upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Separate submit function
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    try {
      const isEditing = !!lecture;
      const url = isEditing
        ? `http://localhost:5000/api/commands/lectures/${lecture.lectureId}`
        : "http://localhost:5000/api/commands/lectures";
      const method = isEditing ? "put" : "post";
      const payload = isEditing ? { title } : { courseId, title };

      const res = await axios[method](url, payload);

      // Always ensure we have lectureId
      const savedLectureId = lecture?.lectureId || res.data.id || res.data.lectureId;
      if (!savedLectureId) throw new Error("No lectureId returned from backend");

      // Upload file if chosen (like CourseLayout)
      if (selectedFile) await handleUpload(selectedFile, savedLectureId);

      onSave(); // refresh CourseLayout lectures
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to save lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{lecture ? "Edit Lecture" : "Add Lecture"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Lecture Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          {/* File upload */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Button variant="outlined" component="label">
              Choose file
              <input
                type="file"
                hidden
                onChange={(e) => setSelectedFile(e.target.files?.[0])}
              />
            </Button>
            <Typography variant="caption">
              {selectedFile?.name || "No file chosen"}
            </Typography>
            {uploading && <Typography variant="caption">Uploading...</Typography>}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading || uploading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || uploading}>
          {loading ? "Saving..." : lecture ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
