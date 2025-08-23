const { db } = require('../config/firebase');

// POST /api/meetings - Create a new meeting
exports.createMeeting = async (req, res) => {
    try {
        const { title, description, date, time, duration, maxParticipants, topics } = req.body;
        const doctor_id = req.user.id;
        const doctor_name = req.user.name;
        if (!title || !description || !date || !time || !duration || !maxParticipants || !topics) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newMeeting = {
            title,
            description,
            date,
            time,
            duration,
            maxParticipants,
            currentParticipants: 0,
            status: 'scheduled',
            topics,
            doctor_id,
            doctor_name,
            createdAt: new Date().toISOString(),
        };
        const docRef = await db.collection('meetings').add(newMeeting);
        const doc = await docRef.get();
        res.status(201).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/meetings/doctor - Get all meetings created by the logged-in doctor
exports.getDoctorMeetings = async (req, res) => {
    try {
        const doctor_id = req.user.id;
        const snapshot = await db.collection('meetings')
            .where('doctor_id', '==', doctor_id)
            .orderBy('date', 'desc')
            .get();
        const meetings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ meetings });
    } catch (error) {
        console.error('Error fetching doctor meetings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/meetings/patient - Get all upcoming/live meetings for patients
exports.getPatientMeetings = async (req, res) => {
    try {
        const now = new Date().toISOString();
        const snapshot = await db.collection('meetings')
            .where('date', '>=', now)
            .orderBy('date', 'asc')
            .get();
        const meetings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ meetings });
    } catch (error) {
        console.error('Error fetching patient meetings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
