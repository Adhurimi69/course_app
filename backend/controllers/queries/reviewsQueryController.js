const Review = require('../../models/nosql/reviewReadModel');

exports.addReview = async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
};

exports.changeReview = async (req, res) => {
  await Review.updateOne(
    { studentId: req.body.studentId, courseId: req.body.courseId },
    { rating: req.body.rating }
  );
  res.sendStatus(200);
};

exports.getReview = async (req, res) => {
  const review = await Review.findOne({
    studentId: req.params.studentId,
    courseId: req.params.courseId
  }).populate('studentId', 'name')
    .populate('courseId', 'title');
  res.json(review);
};

exports.averageReview = async (req, res) => {
  const reviews = await Review.find({ courseId: req.params.courseId });
  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
  res.json({ courseId: req.params.courseId, average: avg });
};
