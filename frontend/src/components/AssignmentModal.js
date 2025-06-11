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
 * - lectureId: string
 * - assignment: { assignmentId, title, dueDate } | null
 * - onClose: () => void
 * - onSave: (assignment) => void
 */
export default function AssignmentModal({
  open,
  lectureId,
  assignment,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDueDate(assignment.dueDate.slice(0, 10)); // yyyy-mm-dd
    } else {
      setTitle("");
      setDueDate("");
    }
    setError(null);
  }, [assignment]);

  const handleSubmit = async () => {
    if (!title.trim() || !dueDate) {
      setError("Title and due date are required");
      return;
    }
    setLoading(true);
    try {
      const url = assignment
        ? `http://localhost:5000/api/commands/assignments/${assignment.assignmentId}`
        : "http://localhost:5000/api/commands/assignments";
      const method = assignment ? "put" : "post";
      const payload = assignment
        ? { title, dueDate }
        : { lectureId, title, dueDate };
      const res = await axios[method](url, payload);
      onSave(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {assignment ? "Edit Assignment" : "Add Assignment"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
          {loading ? "Saving..." : assignment ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
