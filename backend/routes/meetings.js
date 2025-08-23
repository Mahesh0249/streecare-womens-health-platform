const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createMeeting, getDoctorMeetings, getPatientMeetings } = require('../controllers/meetingsController');

// POST /api/meetings - Create a new meeting
router.post('/', protect, createMeeting);

// GET /api/meetings/doctor - Get all meetings created by the logged-in doctor
router.get('/doctor', protect, getDoctorMeetings);

// GET /api/meetings/patient - Get all upcoming/live meetings for patients
router.get('/patient', protect, getPatientMeetings);

module.exports = router;
