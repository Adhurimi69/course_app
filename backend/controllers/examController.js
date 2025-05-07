const Exam = require('../models/Exam');
const Course = require('../models/Course');

// Get all exams (with course info)
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: {
        model: Course,
        attributes: ['id', 'title'],
      },
    });
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByPk(id, {
      include: {
        model: Course,
        attributes: ['id', 'title'],
      },
    });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
};

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const { title, date, courseId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(400).json({ error: 'Invalid courseId' });
    }

    const newExam = await Exam.create({ title, date, courseId });
    res.status(201).json(newExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
};

// Update an exam
exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, courseId } = req.body;

    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(400).json({ error: 'Invalid courseId' });
      }
    }

    exam.title = title || exam.title;
    exam.date = date || exam.date;
    exam.courseId = courseId || exam.courseId;

    await exam.save();
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update exam' });
  }
};

// Delete an exam
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    await exam.destroy();
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete exam' });
  }
};
