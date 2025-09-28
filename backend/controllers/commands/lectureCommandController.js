const Lecture = require("../../models/sql/lecture");
const Course = require("../../models/sql/course");
const { LectureReadModel } = require("../../models/nosql/lectureReadModel");
const { deleteUploads } = require("../commands/uploadController"); // import the helper

const createLecture = async (req, res) => {
  try {
    const { title, courseId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const newLecture = await Lecture.create({ title, courseId });

    // Sync to MongoDB
    await LectureReadModel.create({
      lectureId: newLecture.id,
      title: newLecture.title,
      courseId: course.id,
      courseTitle: course.title,
    });

    res.status(201).json(newLecture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLecture = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    const lecture = await Lecture.findByPk(req.params.id);

    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    let course = null;
    if (courseId) {
      course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(400).json({ error: "Invalid courseId" });
      }
      lecture.courseId = courseId;
    }

    lecture.title = title || lecture.title;
    await lecture.save();

    // Update MongoDB
    await LectureReadModel.findOneAndUpdate(
      { lectureId: lecture.id },
      {
        title: lecture.title,
        courseId: lecture.courseId,
        courseTitle: course ? course.title : undefined,
      }
    );

    res.json(lecture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByPk(req.params.id);
    if (!lecture) return res.status(404).json({ error: "Lecture not found" });

    // 1️⃣ Delete all uploads linked to this lecture (SQL + Mongo + disk)
    await deleteUploads({ lectureId: lecture.id });

    // 2️⃣ Remove lecture-specific file if exists (optional)
    if (lecture.fileName) { // make sure your lecture model has fileName column
      const filePath = path.join(process.cwd(), "uploads/lectures", lecture.fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // 3️⃣ Delete lecture itself from SQL
    await lecture.destroy();

    // 4️⃣ Delete lecture from Mongo
    await LectureReadModel.deleteOne({ lectureId: lecture.id });

    res.json({ message: "Lecture and all linked uploads deleted successfully." });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLecture,
  updateLecture,
  deleteLecture,
};
