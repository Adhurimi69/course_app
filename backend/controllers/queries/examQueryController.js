const { ExamReadModel } = require("../../models/nosql/examReadModel");

const getAllExams = async (req, res) => {
  try {
    const exams = await ExamReadModel.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await ExamReadModel.findOne({ examId: req.params.id });

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllExams,
  getExamById,
};
