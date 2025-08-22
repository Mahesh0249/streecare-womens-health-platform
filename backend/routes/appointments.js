const express = require('express');
const router = express.Router();
const { getAppointments, addAppointment, getDoctors } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAppointments);
router.post('/', protect, addAppointment);
router.get('/doctors', protect, getDoctors);

module.exports = router;
