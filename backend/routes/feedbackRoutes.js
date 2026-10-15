const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/feedbackController');

const rating = body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be a whole number from 1 to 5').toInt();
const comments = body('comments').trim().isLength({ min: 3, max: 500 }).withMessage('Comments must be 3–500 characters');
const idParam = param('id').isMongoId().withMessage('Invalid feedback id');

router.use(protect);

router.post(
  '/',
  authorize('student'),
  [body('facultyId').trim().notEmpty().withMessage('Select a faculty member'), rating, comments],
  validate,
  c.createFeedback
);

router.get('/', authorize('faculty'), c.getAllFeedback);
router.get('/mine', authorize('student'), c.getMyFeedback); // must stay above '/:id'
router.get('/:id', [idParam], validate, c.getFeedbackById);

router.put(
  '/:id',
  authorize('student'),
  [idParam, rating.optional(), comments.optional()],
  validate,
  c.updateFeedback
);

router.delete('/:id', authorize('student'), [idParam], validate, c.deleteFeedback);

module.exports = router;
