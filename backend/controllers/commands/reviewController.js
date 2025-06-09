const Review = require('../../models/sql/review');
const Student = require('../../models/sql/student');
const Course = require('../../models/sql/course');

exports.addReview = async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
};

exports.changeReview = async (req, res) => {
  await Review.update(
    { rating: req.body.rating },
    { where: { studentId: req.body.studentId, courseId: req.body.courseId } }
  );
  res.sendStatus(200);
};

exports.getReview = async (req, res) => {
  const review = await Review.findOne({
    where: { studentId: req.params.studentId, courseId: req.params.courseId },
    include: [
      { model: Student, attributes: ['id', 'name'] },
      { model: Course, attributes: ['id', 'title'] }
    ]
  });
  res.json(review);
};

exports.averageReview = async (req, res) => {
  const courseId = req.params.courseId;
  const review = await Review.findAll({ where: { courseId } });
  const avg = review.reduce((acc, r) => acc + r.rating, 0) / (review.length || 1);
  res.json({ courseId, average: avg });
};
