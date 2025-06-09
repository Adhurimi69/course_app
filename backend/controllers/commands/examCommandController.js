const Exam = require("../../models/sql/exam");
const Course = require("../../models/sql/course");  // <-- Added missing import
const { ExamReadModel } = require("../../models/nosql/examReadModel");

const createExam = async (req, res) => {
  try {
    const { title, date, courseId } = req.body;

    if (!title || !date || !courseId) {
      return res.status(400).json({ error: "Title, date, and courseId are required." });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    const newExam = await Exam.create({ title, date, courseId });

    // Sync to MongoDB
    await ExamReadModel.create({
      examId: newExam.id,
      title: newExam.title,
      date: newExam.date,
      courseId: course.id,
      courseTitle: course.title, // fixed from course.name to course.title
    });

    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const { title, date, courseId } = req.body;
    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    let updatedCourseTitle;

    if (courseId && courseId !== exam.courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ error: "New course not found." });
      }
      exam.courseId = courseId;
      updatedCourseTitle = course.title; // fixed here as well
    }

    exam.title = title || exam.title;
    exam.date = date || exam.date;

    await exam.save();

    const updateData = {
      title: exam.title,
      date: exam.date,
      courseId: exam.courseId,
    };

    if (updatedCourseTitle) {
      updateData.courseTitle = updatedCourseTitle;
    }

    await ExamReadModel.findOneAndUpdate(
      { examId: exam.id },
      updateData,
      { new: true, upsert: true }
    );

    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    await exam.destroy();
    await ExamReadModel.deleteOne({ examId: exam.id });

    res.json({ message: "Exam deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExam,
  updateExam,
  deleteExam,
};
