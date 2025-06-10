const { LectureReadModel } = require("../../models/nosql/lectureReadModel");

const getAllLectures = async (req, res) => {
  try {
    const lectures = await LectureReadModel.find();
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLectureById = async (req, res) => {
  try {
    const lecture = await LectureReadModel.findOne({
      lectureId: req.params.id,
    });

    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    res.json(lecture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLectureByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lectures = await LectureReadModel.find({ courseId });
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllLectures,
  getLectureById,
  getLectureByCourse,
};
