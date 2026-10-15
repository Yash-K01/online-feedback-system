const Faculty = require('../models/Faculty');

// GET /api/faculty  -> list used by the student's "select faculty" dropdown
exports.listFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.find().sort('facultyName').select('facultyId facultyName');
    res.json(faculty);
  } catch (err) {
    next(err);
  }
};
