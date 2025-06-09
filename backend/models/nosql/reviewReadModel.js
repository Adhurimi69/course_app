// models/review.mongo.model.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  rating: Number,
});
module.exports = mongoose.model('Review', ReviewSchema);
