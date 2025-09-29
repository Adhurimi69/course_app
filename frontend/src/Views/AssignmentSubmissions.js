import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Select, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function AssignmentSubmissions() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/queries/courses');
      setCourses(res.data || []);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const fetchAssignments = async (courseId) => {
    try {
      const res = await axios.get(`/api/queries/assignments/course/${courseId}`);
      setAssignments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch assignments', err);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await axios.get(`/api/queries/uploads?assignmentId=${assignmentId}`);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Assignment Submissions</Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Select value={selectedCourse} onChange={(e) => { setSelectedCourse(e.target.value); fetchAssignments(e.target.value); }} displayEmpty sx={{ minWidth: 240 }}>
          <MenuItem value=""><em>-- Select Course --</em></MenuItem>
          {courses.map(c => <MenuItem key={c.courseId} value={c.courseId}>{c.title}</MenuItem>)}
        </Select>

        <Select value={selectedAssignment} onChange={(e) => { setSelectedAssignment(e.target.value); fetchSubmissions(e.target.value); }} displayEmpty sx={{ minWidth: 360 }}>
          <MenuItem value=""><em>-- Select Assignment --</em></MenuItem>
          {assignments.map(a => <MenuItem key={a.assignmentId} value={a.assignmentId}>{a.title}</MenuItem>)}
        </Select>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>File</TableCell>
            <TableCell>Student</TableCell>
            <TableCell>Uploaded</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.file}</TableCell>
              <TableCell>{s.student?.name || '—'}</TableCell>
              <TableCell>{s.timeUploaded ? new Date(s.timeUploaded).toLocaleString() : '—'}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => window.open(`/api/queries/uploads/${s.id}/download`, '_blank')}>Download</Button>
                <Button size="small" color="error" onClick={async () => {
                  if (!window.confirm('Delete?')) return;
                  try {
                    await axios.delete(`/api/commands/upload/${s.id}`);
                    fetchSubmissions(selectedAssignment);
                  } catch (err) {
                    console.error('Delete failed', err);
                  }
                }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
