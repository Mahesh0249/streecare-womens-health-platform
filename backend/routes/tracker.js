const express = require('express');
const router = express.Router();
const { getLogs, addLog } = require('../controllers/trackerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/logs', protect, getLogs);
router.post('/logs', protect, addLog);

module.exports = router;
