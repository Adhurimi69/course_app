import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/queries/assignments');
      setAssignments(res.data || []);
    } catch (err) { console.error(err); }
  };

  const doUpload = async (assignmentId) => {
    if (!selectedFile) return alert('Choose a file first');
    const fd = new FormData();
    fd.append('assignmentId', assignmentId);
    const user = JSON.parse(localStorage.getItem('user') || 'null') || {};
    if (user?.id) fd.append('studentId', user.id);
    fd.append('file', selectedFile);
    try {
      setUploading(true);
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:5000/api/commands/upload', fd, { headers: { Authorization: `Bearer ${token}` } });
      alert('Uploaded');
      setSelectedFile(null);
    } catch (err) { console.error(err); alert('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Your Assignments</Typography>
      <Box mt={2}>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
      </Box>
      <Box mt={2}>
        {assignments.map(a => (
          <Box key={a.assignmentId || a.id} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
            <Typography>{a.title || a.name || `Assignment ${a.assignmentId || a.id}`}</Typography>
            <Button onClick={() => doUpload(a.assignmentId || a.id)} variant="contained" disabled={uploading}>Upload</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
