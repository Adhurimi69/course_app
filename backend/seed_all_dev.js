/*
Dev seeder for both SQL (Sequelize) and Mongo read-models (Mongoose).
Usage (from backend folder):
  NODE_ENV=development node seed_all_dev.js       # run full wipe + seed
  NODE_ENV=development node seed_all_dev.js --wipe-only
  NODE_ENV=development node seed_all_dev.js --seed-only

This script is destructive: it will drop SQL tables and Mongo collections when run with wipe enabled.
It is intentionally guarded to not run in production (NODE_ENV must not be 'production').
*/

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to run seeder in production');
  process.exit(1);
}

const args = process.argv.slice(2);
const wipeOnly = args.includes('--wipe-only');
const seedOnly = args.includes('--seed-only');

const { sequelize } = require('./config/db');
const Student = require('./models/sql/student');
const Teacher = require('./models/sql/teacher');
const Admin = require('./models/sql/admin');
const Course = require('./models/sql/course');
const Department = require('./models/sql/department');
const Lecture = require('./models/sql/lecture');
const Assignment = require('./models/sql/assignment');
const Exam = require('./models/sql/exam');
const StudentCourse = require('./models/sql/studentCourse');
const Grade = require('./models/sql/grade');
const AssignmentGrade = require('./models/sql/assignemntGrade');
const StudentExam = require('./models/sql/studentExam');
const Upload = require('./models/sql/upload');
const mongooseConnect = require('./config/mongo');

(async () => {
  try {
    console.log('Starting dev seeder...');

    // 1) Wipe and recreate SQL schema if not seedOnly
    if (!seedOnly) {
      console.log('Recreating SQL schema (drop all tables + sync) ...');
      try {
        // disable foreign key checks for MySQL to avoid drop ordering issues
        console.log('Disabling foreign key checks...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        const qi = sequelize.getQueryInterface();
        console.log('Dropping all SQL tables via QueryInterface.dropAllTables()...');
        await qi.dropAllTables();
        console.log('Re-enabling foreign key checks...');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      } catch (dropErr) {
        console.warn('dropAllTables failed, attempting fallback drop via sequelize.drop():', dropErr && dropErr.message);
        try {
          await sequelize.drop();
        } catch (dropErr2) {
          console.error('Fallback sequelize.drop() also failed:', dropErr2 && dropErr2.message);
          throw dropErr2;
        }
      }
      // recreate schema
      await sequelize.sync();
      console.log('SQL schema recreated.');
    }

    if (wipeOnly) {
      console.log('Wipe-only requested. Exiting.');
      process.exit(0);
    }

  // 2) Seed SQL test data
  console.log('Seeding SQL test data...');

    // create department
    const dept = await Department.create({ name: 'Computer Science' });

    // create teacher
    const teacher = await Teacher.create({ name: 'Test Teacher', email: 'teacher@test.com', password: 'pass', role: 'teacher' });

    // create students
    const student1 = await Student.create({ name: 'Test Student', email: 'student@test.com', password: 'pass', role: 'student' });
    const student2 = await Student.create({ name: 'Second Student', email: 'student2@test.com', password: 'pass', role: 'student' });

    // create course
    const course = await Course.create({ title: 'Intro to Testing', teacherId: teacher.id, departmentId: dept.id, enrollment_key: '123' });

    // enroll students
    await StudentCourse.create({ studentId: student1.id, courseId: course.id, enrollmentKey: '123' });
    await StudentCourse.create({ studentId: student2.id, courseId: course.id });

    // lectures
    const lecture1 = await Lecture.create({ title: 'Lecture 1', content: 'Welcome', courseId: course.id });

    // assignments
    const assignment1 = await Assignment.create({ title: 'Homework 1', dueDate: new Date(), lectureId: lecture1.id, courseId: course.id, points: 10 });

    // exams
    const exam1 = await Exam.create({ title: 'Midterm', date: new Date(), courseId: course.id, points: 100 });

    // assignment grade (SQL) for student1
    await AssignmentGrade.create({ studentId: student1.id, assignmentId: assignment1.id, score: 8 });

    // course grade (SQL)
    await Grade.create({ studentId: student1.id, courseId: course.id, score: 85 });

  // student exam grade (SQL)
  await StudentExam.create({ studentId: student1.id, examId: exam1.id, score: 74 });

    // uploads
    await Upload.create({ file: 'lecture1.pdf', lectureId: lecture1.id, courseId: course.id, uploaderId: teacher.id, uploaderRole: 'teacher' });

    console.log('SQL seeding complete.');

    // 3) Seed Mongo read-models
    console.log('Connecting to Mongo...');
    await mongooseConnect();
    const StudentRead = require('./models/nosql/studentReadModel');
    const CourseRead = require('./models/nosql/courseReadModel');
    const LectureRead = require('./models/nosql/lectureReadModel');
    const AssignmentRead = require('./models/nosql/assignmentReadModel');
    const ExamRead = require('./models/nosql/examReadModel');
    const StudentCourseRead = require('./models/nosql/studentCourseReadModel');
    const AssignmentGradeRead = require('./models/nosql/assignmentGradeReadModel');
    const GradeRead = require('./models/nosql/gradeReadModel');

    // clear existing read-model collections
    console.log('Clearing existing read-model collections...');
    await Promise.all([
      StudentRead.StudentReadModel.deleteMany({}),
      CourseRead.CourseReadModel.deleteMany({}),
      LectureRead.LectureReadModel.deleteMany({}),
      AssignmentRead.AssignmentReadModel.deleteMany({}),
      ExamRead.ExamReadModel.deleteMany({}),
      StudentCourseRead.deleteMany({}),
      AssignmentGradeRead.deleteMany({}),
      GradeRead.deleteMany({}),
    ]);

    // create read-model records mirroring SQL data
    console.log('Creating read-model documents...');
    const s1 = await StudentRead.StudentReadModel.create({ studentId: student1.id, name: student1.name, email: student1.email, role: 'student' });
    const s2 = await StudentRead.StudentReadModel.create({ studentId: student2.id, name: student2.name, email: student2.email, role: 'student' });
    const c1 = await CourseRead.CourseReadModel.create({ courseId: course.id, title: course.title, teacherId: teacher.id, departmentId: dept.id, departmentName: 'Computer Science' });
    const l1 = await LectureRead.LectureReadModel.create({ lectureId: lecture1.id, title: lecture1.title, content: lecture1.content, courseId: course.id, courseTitle: course.title });
    const a1 = await AssignmentRead.AssignmentReadModel.create({ assignmentId: assignment1.id, title: assignment1.title, dueDate: assignment1.dueDate, lectureId: lecture1.id, lectureTitle: lecture1.title, courseId: course.id, courseTitle: course.title, points: assignment1.points });
    const e1 = await ExamRead.ExamReadModel.create({ examId: exam1.id, title: exam1.title, date: exam1.date, courseId: course.id, courseTitle: course.title, points: exam1.points });

    // student-course read-models (populate refs to StudentReadModel and CourseReadModel)
    await StudentCourseRead.create({ studentId: s1._id, courseId: c1._id });
    await StudentCourseRead.create({ studentId: s2._id, courseId: c1._id });

    // assignment grade read-models
    await AssignmentGradeRead.create({ studentId: s1._id, assignmentId: a1._id, score: 8 });

  // student-exam read-models
  const StudentExamRead = require('./models/nosql/studentExamReadModel');
  await StudentExamRead.create({ studentId: s1._id, examId: e1._id, score: 74 });

    // grade read-models
    await GradeRead.create({ studentId: s1._id, courseId: c1._id, score: 85 });

    console.log('Mongo read-model seeding complete.');
    console.log('Dev seeder finished successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeder error', err && err.stack || err);
    process.exit(1);
  }
})();
