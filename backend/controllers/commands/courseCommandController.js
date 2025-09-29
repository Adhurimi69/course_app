const Course = require("../../models/sql/course");
const Department = require("../../models/sql/department");
const { CourseReadModel } = require("../../models/nosql/courseReadModel");

const createCourse = async (req, res) => {
  try {
    const { title, departmentId, enrollmentKey, teacherId } = req.body;
    let assignedTeacherId = teacherId || null;
    // If authenticated teacher creates the course and no teacherId provided, assign them
    if (!assignedTeacherId && req.user && req.user.role === 'teacher' && req.user.id) {
      assignedTeacherId = req.user.id;
    }

    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(400).json({ error: "Invalid departmentId" });
    }

  const newCourse = await Course.create({ title, departmentId, enrollment_key: enrollmentKey || null, teacherId: assignedTeacherId || null });

    // Sync to MongoDB
    await CourseReadModel.create({
      courseId: newCourse.id,
      title: newCourse.title,
      teacherId: newCourse.teacherId || null,
      departmentId: department.id,
      departmentName: department.name,
      createdAt: newCourse.createdAt,
      updatedAt: newCourse.updatedAt,
      enrollmentKey: newCourse.enrollment_key,
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
  const { id } = req.params;
  const { title, departmentId, enrollmentKey, teacherId } = req.body;

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
  if (enrollmentKey !== undefined) course.enrollment_key = enrollmentKey;
  if (teacherId !== undefined) course.teacherId = teacherId;
    await course.save();

    // Update Mongo
    await CourseReadModel.findOneAndUpdate(
      { courseId: course.id },
      {
        title: course.title,
        teacherId: course.teacherId || null,
        departmentId: departmentId || course.departmentId,
        departmentName: department ? department.name : undefined,
        updatedAt: new Date(),
        enrollmentKey: course.enrollment_key,
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
