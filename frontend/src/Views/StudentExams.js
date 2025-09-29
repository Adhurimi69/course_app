import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

export default function StudentExams() {
  const [exams, setExams] = useState([]);
  

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/queries/exams');
      setExams(res.data || []);
    } catch (err) { console.error(err); }
  };

  // students are not allowed to upload exams; uploads are handled by teachers.

  return (
    <Box p={3}>
      <Typography variant="h5">Your Exams</Typography>
      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">Exam files are managed by teachers. Students can view exam details here but cannot upload exam files.</Typography>
      </Box>
      <Box mt={2}>
        {exams.map(ex => (
          <Box key={ex.examId || ex.id} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
            <Typography>{ex.title || ex.name || `Exam ${ex.examId || ex.id}`}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
