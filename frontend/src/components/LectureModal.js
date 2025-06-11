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
} from "@mui/material";

/**
 * Props:
 * - open: boolean
 * - courseId: string
 * - lecture: { lectureId, title } | null
 * - onClose: () => void
 * - onSave: (lecture) => void
 */
export default function LectureModal({
  open,
  courseId,
  lecture,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // When editing, prefill
  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title);
    } else {
      setTitle("");
    }
    setError(null);
  }, [lecture]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    try {
      const url = lecture
        ? `http://localhost:5000/api/commands/lectures/${lecture.lectureId}`
        : "http://localhost:5000/api/commands/lectures";
      const method = lecture ? "put" : "post";
      const payload = lecture ? { title } : { courseId, title };
      const res = await axios[method](url, payload);
      onSave(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save lecture");
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Saving..." : lecture ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
