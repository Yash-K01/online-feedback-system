const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { listFaculty } = require('../controllers/facultyController');

router.get('/', protect, listFaculty);

module.exports = router;
