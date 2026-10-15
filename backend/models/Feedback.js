const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    facultyId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
