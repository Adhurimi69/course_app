import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function CourseCard({
  course,
  departments,
  openModal,
  onDelete,
}) {
  const navigate = useNavigate();

  // map departmentId to department name
  const deptName =
    departments.find((d) => d.departmentId === course.departmentId)?.name ||
    course.departmentId;

  return (
    <Box className="relative bg-white rounded-2xl shadow-lg p-4 flex flex-col h-full">
      {/* Course Image */}
      <img
        src={course.imageUrl || "/placeholder.jpg"}
        className="w-full h-36 object-cover rounded-lg mb-4"
      />

      {/* Department Badge */}
      <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs uppercase px-2 py-0.5 rounded">
        {deptName}
      </span>

      {/* Title */}
      <Typography variant="h6" className="font-semibold mb-2">
        {course.title}
      </Typography>

      {/* Rating */}
      <Box className="flex items-center text-gray-500 text-sm mb-2">
        <StarIcon fontSize="inherit" className="text-yellow-400 mr-1" />
        <Typography variant="body2" component="span">
          {course.rating || "0"}k
        </Typography>
      </Box>

      {/* Stats row */}
      <Box className="flex items-center justify-between text-gray-500 text-xs mb-4 space-x-4">
        <Box className="flex items-center">
          <MenuBookIcon fontSize="inherit" className="mr-1" />
          <span>{course.lessons || 0} Lessons</span>
        </Box>
        <Box className="flex items-center">
          <PeopleIcon fontSize="inherit" className="mr-1" />
          <span>{course.students || 0}+ Students</span>
        </Box>
      </Box>

      {/* Footer: Edit/Delete + Enroll */}
      <Box
        mt="auto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box className="flex space-x-4">
          <Button
            variant="outlined"
            size="small"
            onClick={() => openModal("edit", course)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => onDelete(course.courseId)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/teachers/courses/${course.courseId}`)}
          >
            View
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
