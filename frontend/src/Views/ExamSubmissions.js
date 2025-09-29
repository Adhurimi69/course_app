import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Select, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function ExamSubmissions() {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
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

  const fetchExams = async (courseId) => {
    try {
      const res = await axios.get(`/api/queries/exams/course/${courseId}`);
      setExams(res.data || []);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    }
  };

  const fetchSubmissions = async (examId) => {
    try {
      const res = await axios.get(`/api/queries/uploads?examId=${examId}`);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Exam Submissions</Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Select value={selectedCourse} onChange={(e) => { setSelectedCourse(e.target.value); fetchExams(e.target.value); }} displayEmpty sx={{ minWidth: 240 }}>
          <MenuItem value=""><em>-- Select Course --</em></MenuItem>
          {courses.map(c => <MenuItem key={c.courseId} value={c.courseId}>{c.title}</MenuItem>)}
        </Select>

        <Select value={selectedExam} onChange={(e) => { setSelectedExam(e.target.value); fetchSubmissions(e.target.value); }} displayEmpty sx={{ minWidth: 360 }}>
          <MenuItem value=""><em>-- Select Exam --</em></MenuItem>
          {exams.map(a => <MenuItem key={a.examId} value={a.examId}>{a.title}</MenuItem>)}
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
                    fetchSubmissions(selectedExam);
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
