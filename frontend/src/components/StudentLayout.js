import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography } from "@mui/material";

export default function StudentLayout() {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const [lecRes, examRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/queries/lectures/course/${courseId}`
          ),
          axios.get(
            `http://localhost:5000/api/queries/exams?courseId=${courseId}`
          ),
        ]);
        setLectures(lecRes.data);
        setExams(examRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load course content.");
      }
    }
    fetchContent();
  }, [courseId]);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Lectures
      </Typography>
      {lectures.map((lec) => (
        <Box
          key={lec.lectureId}
          sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 2 }}
        >
          <Typography variant="h6">{lec.title}</Typography>
          <Typography variant="body2">{lec.description}</Typography>
          {(lec.assignments || []).map((asg) => (
            <Box key={asg.assignmentId} sx={{ ml: 2, mt: 1 }}>
              <Typography variant="body2">Assignment: {asg.title}</Typography>
              <Typography variant="caption">
                Due: {new Date(asg.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}

      <Typography variant="h5" mt={4} gutterBottom>
        Exams
      </Typography>
      {exams.map((ex) => (
        <Box
          key={ex.examId}
          sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 2 }}
        >
          <Typography variant="body1">{ex.title}</Typography>
          <Typography variant="caption">
            Date: {new Date(ex.date).toLocaleDateString()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
