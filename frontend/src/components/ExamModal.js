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
 * - exam: { examId, title, date } | null
 * - onClose: () => void
 * - onSave: (exam) => void
 */
export default function ExamModal({ open, courseId, exam, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exam) {
      setTitle(exam.title);
      setDate(exam.date.slice(0, 10));
    } else {
      setTitle("");
      setDate("");
    }
    setError(null);
  }, [exam]);

  const handleSubmit = async () => {
    if (!title.trim() || !date) {
      setError("Title and date are required");
      return;
    }
    setLoading(true);
    try {
      const url = exam
        ? `http://localhost:5000/api/commands/exams/${exam.examId}`
        : "http://localhost:5000/api/commands/exams";
      const method = exam ? "put" : "post";
      const payload = exam ? { title, date } : { courseId, title, date };
      const res = await axios[method](url, payload);
      onSave(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{exam ? "Edit Exam" : "Add Exam"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Exam Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Saving..." : exam ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
