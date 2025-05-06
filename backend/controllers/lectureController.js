const Lecture = require('../models/Lecture');
const Course = require('../models/Course');

// Create a new lecture
exports.createLecture = async (req, res) => {
  try {
    const { title, courseId } = req.body;

    // Optional: Check if the course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lecture = await Lecture.create({ title, courseId });
    res.status(201).json(lecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all lectures
exports.getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.findAll({ include: Course });
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one lecture by ID
exports.getLectureById = async (req, res) => {
  try {
    const { id } = req.params;
    const lecture = await Lecture.findByPk(id, { include: Course });

    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    res.json(lecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a lecture
exports.updateLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, courseId } = req.body;

    const lecture = await Lecture.findByPk(id);
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    // Optional: Check if the new courseId exists
    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
    }

    await lecture.update({ title, courseId });
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a lecture
exports.deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const lecture = await Lecture.findByPk(id);

    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    await lecture.destroy();
    res.json({ message: 'Lecture deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
