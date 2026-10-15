const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Attach studentName and facultyName so the UI can display them
const enrich = async (docs) => {
  const list = Array.isArray(docs) ? docs : [docs];
  const sIds = [...new Set(list.map((f) => f.studentId))];
  const fIds = [...new Set(list.map((f) => f.facultyId))];
  const [students, faculty] = await Promise.all([
    Student.find({ studentId: { $in: sIds } }).select('studentId name'),
    Faculty.find({ facultyId: { $in: fIds } }).select('facultyId facultyName'),
  ]);
  const sMap = Object.fromEntries(students.map((s) => [s.studentId, s.name]));
  const fMap = Object.fromEntries(faculty.map((f) => [f.facultyId, f.facultyName]));
  const out = list.map((f) => ({
    ...f.toObject(),
    studentName: sMap[f.studentId] || 'Unknown student',
    facultyName: fMap[f.facultyId] || 'Unknown faculty',
  }));
  return Array.isArray(docs) ? out : out[0];
};

const httpError = (status, message) => Object.assign(new Error(message), { statusCode: status });

// CREATE  POST /api/feedback   (student)
exports.createFeedback = async (req, res, next) => {
  try {
    const { facultyId, rating, comments } = req.body;
    const faculty = await Faculty.findOne({ facultyId });
    if (!faculty) throw httpError(404, 'Faculty not found');

    const feedback = await Feedback.create({
      studentId: req.user.refId, // taken from the token, never from the body
      facultyId,
      rating,
      comments,
    });
    res.status(201).json(await enrich(feedback));
  } catch (err) {
    next(err);
  }
};

// READ ALL  GET /api/feedback?student=<name>&facultyId=<id>   (faculty)
exports.getAllFeedback = async (req, res, next) => {
  try {
    const filter = {};
    const { student, facultyId } = req.query;

    if (facultyId) filter.facultyId = facultyId;

    if (student && student.trim()) {
      // Search by student NAME (case-insensitive, partial match)
      const ids = await Student.find({
        name: { $regex: escapeRegex(student.trim()), $options: 'i' },
      }).distinct('studentId');
      filter.studentId = { $in: ids };
    }

    const feedback = await Feedback.find(filter).sort('-createdAt');
    res.json(await enrich(feedback));
  } catch (err) {
    next(err);
  }
};

// READ OWN  GET /api/feedback/mine   (student)
exports.getMyFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ studentId: req.user.refId }).sort('-createdAt');
    res.json(await enrich(feedback));
  } catch (err) {
    next(err);
  }
};

// READ ONE  GET /api/feedback/:id
exports.getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) throw httpError(404, 'Feedback not found');
    if (req.user.role === 'student' && feedback.studentId !== req.user.refId) {
      throw httpError(403, 'You can only view your own feedback');
    }
    res.json(await enrich(feedback));
  } catch (err) {
    next(err);
  }
};

// UPDATE  PUT /api/feedback/:id   (owner student)
exports.updateFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) throw httpError(404, 'Feedback not found');
    if (feedback.studentId !== req.user.refId) {
      throw httpError(403, 'You can only edit your own feedback');
    }
    const { rating, comments } = req.body;
    if (rating !== undefined) feedback.rating = rating;
    if (comments !== undefined) feedback.comments = comments;
    await feedback.save();
    res.json(await enrich(feedback));
  } catch (err) {
    next(err);
  }
};

// DELETE  DELETE /api/feedback/:id   (owner student)
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) throw httpError(404, 'Feedback not found');
    if (feedback.studentId !== req.user.refId) {
      throw httpError(403, 'You can only delete your own feedback');
    }
    await feedback.deleteOne();
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    next(err);
  }
};
