import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

export default function CourseModal({
  open,
  mode,
  title,
  departmentId,
  departments,
  onClose,
  onChangeTitle,
  onChangeDept,
  onSubmit,
  onChangeImage,  // function to handle file input
  previewImage,    // base64 string for preview
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "edit" ? "Edit Course" : "Add Course"}
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Course Title"
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel id="dept-label">Department</InputLabel>
            <Select
              labelId="dept-label"
              value={departmentId}
              label="Department"
              onChange={(e) => onChangeDept(e.target.value)}
              required
            >
              {departments.map((d) => (
                <MenuItem key={d.departmentId} value={d.departmentId}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Image Upload */}
          <Button variant="outlined" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={onChangeImage} // call parent handler
            />
          </Button>

          {/* Preview */}
          {previewImage && (
            <Box mt={2}>
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          {mode === "edit" ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
