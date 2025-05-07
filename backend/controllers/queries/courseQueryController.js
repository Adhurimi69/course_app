const { CourseReadModel } = require("../../models/nosql/courseReadModel");

const getCourses = async (req, res) => {
  try {
    const courses = await CourseReadModel.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await CourseReadModel.findOne({ courseId: req.params.id });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
};
