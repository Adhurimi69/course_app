const Course = require('../models/Course');
const Department = require('../models/Department');

// Get all courses (with department info)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: Department,
        attributes: ['id', 'name'],
      },
    });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, departmentId } = req.body;

    // Kontrollo nëse ekziston departamenti
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(400).json({ error: 'Invalid departmentId' });
    }

    const newCourse = await Course.create({ title, departmentId });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, departmentId } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Opsionale: kontrollo nëse po ndryshohet departmentId dhe ai ekziston
    if (departmentId) {
      const department = await Department.findByPk(departmentId);
      if (!department) {
        return res.status(400).json({ error: 'Invalid departmentId' });
      }
    }

    course.title = title || course.title;
    course.departmentId = departmentId || course.departmentId;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};
