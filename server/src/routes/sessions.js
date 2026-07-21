const express = require('express');
const {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getSessions).post(createSession);
router.route('/:id').put(updateSession).delete(deleteSession);

module.exports = router;
