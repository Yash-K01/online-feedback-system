const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const signToken = (role, refId, name) =>
  jwt.sign({ role, refId, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const authResponse = (res, status, role, refId, name) =>
  res.status(status).json({
    token: signToken(role, refId, name),
    user: { role, id: refId, name },
  });

// ---------- Student ----------
exports.registerStudent = async (req, res, next) => {
  try {
    const { studentId, name, password } = req.body;
    const student = await Student.create({ studentId, name, password });
    authResponse(res, 201, 'student', student.studentId, student.name);
  } catch (err) {
    next(err);
  }
};

exports.loginStudent = async (req, res, next) => {
  try {
    const { studentId, password } = req.body;
    const student = await Student.findOne({ studentId }).select('+password');
    if (!student || !(await student.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid student ID or password' });
    }
    authResponse(res, 200, 'student', student.studentId, student.name);
  } catch (err) {
    next(err);
  }
};

// ---------- Faculty ----------
exports.registerFaculty = async (req, res, next) => {
  try {
    const { facultyId, facultyName, password } = req.body;
    const faculty = await Faculty.create({ facultyId, facultyName, password });
    authResponse(res, 201, 'faculty', faculty.facultyId, faculty.facultyName);
  } catch (err) {
    next(err);
  }
};

exports.loginFaculty = async (req, res, next) => {
  try {
    const { facultyId, password } = req.body;
    const faculty = await Faculty.findOne({ facultyId }).select('+password');
    if (!faculty || !(await faculty.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid faculty ID or password' });
    }
    authResponse(res, 200, 'faculty', faculty.facultyId, faculty.facultyName);
  } catch (err) {
    next(err);
  }
};
