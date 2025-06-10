import React, { useState } from "react";
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
 * AddLectureModal
 * Props:
 * - open: boolean
 * - courseId: string
 * - onClose: () => void
 * - onLectureAdded: (lecture) => void
 */
export default function LectureModal({
  open,
  courseId,
  onClose,
  onLectureAdded,
}) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/commands/lectures",
        {
          courseId,
          title,
        }
      );
      onLectureAdded(res.data);
      setTitle("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Add Lecture</DialogTitle>
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
        <Button onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
