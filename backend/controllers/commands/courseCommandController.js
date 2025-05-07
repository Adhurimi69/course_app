const Course = require("../../models/sql/course");
const Department = require("../../models/sql/department");
const { CourseReadModel } = require("../../models/nosql/courseReadModel");

const createCourse = async (req, res) => {
  try {
    const { title, departmentId } = req.body;

    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(400).json({ error: "Invalid departmentId" });
    }

    const newCourse = await Course.create({ title, departmentId });

    // Sync to MongoDB
    await CourseReadModel.create({
      courseId: newCourse.id,
      title: newCourse.title,
      departmentId: department.id,
      departmentName: department.name,
      createdAt: newCourse.createdAt,
      updatedAt: newCourse.updatedAt,
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, departmentId } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    let department = null;
    if (departmentId) {
      department = await Department.findByPk(departmentId);
      if (!department) {
        return res.status(400).json({ error: "Invalid departmentId" });
      }
      course.departmentId = departmentId;
    }

    course.title = title || course.title;
    await course.save();

    // Update Mongo
    await CourseReadModel.findOneAndUpdate(
      { courseId: course.id },
      {
        title: course.title,
        departmentId: departmentId || course.departmentId,
        departmentName: department ? department.name : undefined,
        updatedAt: new Date(),
      }
    );

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await course.destroy();

    await CourseReadModel.deleteOne({ courseId: course.id });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
};
