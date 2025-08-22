const express = require('express');
const router = express.Router();
const { getMusic } = require('../controllers/musicController');
const { protect } = require('../middleware/authMiddleware');

// 'protect' middleware is used to ensure only logged-in users can access it, even though it's static data
router.get('/', protect, getMusic);

module.exports = router;
