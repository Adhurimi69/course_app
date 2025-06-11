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
  role = "admin", // default fallback
}) {
  const navigate = useNavigate();

  const deptName =
    departments.find((d) => d.departmentId === course.departmentId)?.name ||
    course.departmentId;

  const handleViewClick = () => {
    if (role === "student") {
      navigate(`/students/courses/${course.id}`);
    } else {
      navigate(`/teachers/courses/${course.id}`);
    }
  };

  return (
    <Box className="relative bg-white rounded-2xl shadow-lg p-4 flex flex-col h-full">
      <img
        src={course.imageUrl || "/placeholder.jpg"}
        className="w-full h-36 object-cover rounded-lg mb-4"
      />

      <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs uppercase px-2 py-0.5 rounded">
        {deptName}
      </span>

      <Typography variant="h6" className="font-semibold mb-2">
        {course.title}
      </Typography>

      <Box className="flex items-center text-gray-500 text-sm mb-2">
        <StarIcon fontSize="inherit" className="text-yellow-400 mr-1" />
        <Typography variant="body2" component="span">
          {course.rating || "0"}k
        </Typography>
      </Box>

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

      <Box
        mt="auto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {role === "admin" || role === "teacher" ? (
          <Box className="flex space-x-4">
            {role !== "student" && (
              <>
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
                  onClick={() => onDelete(course.id)}
                >
                  Delete
                </Button>
              </>
            )}
            <Button variant="contained" size="small" onClick={handleViewClick}>
              View
            </Button>
          </Box>
        ) : (
          <Button variant="contained" size="small" onClick={handleViewClick}>
            View Course
          </Button>
        )}
      </Box>
    </Box>
  );
}
