const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const c = require('../controllers/authController');

const pwd = body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');

router.post(
  '/student/register',
  [
    body('studentId').trim().notEmpty().withMessage('Student ID is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    pwd,
  ],
  validate,
  c.registerStudent
);

router.post(
  '/student/login',
  [body('studentId').trim().notEmpty().withMessage('Student ID is required'),
   body('password').notEmpty().withMessage('Password is required')],
  validate,
  c.loginStudent
);

router.post(
  '/faculty/register',
  [
    body('facultyId').trim().notEmpty().withMessage('Faculty ID is required'),
    body('facultyName').trim().notEmpty().withMessage('Faculty name is required'),
    pwd,
  ],
  validate,
  c.registerFaculty
);

router.post(
  '/faculty/login',
  [body('facultyId').trim().notEmpty().withMessage('Faculty ID is required'),
   body('password').notEmpty().withMessage('Password is required')],
  validate,
  c.loginFaculty
);

module.exports = router;
