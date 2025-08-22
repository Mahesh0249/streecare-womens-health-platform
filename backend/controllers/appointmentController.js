const { db } = require('../config/firebase');

exports.getAppointments = async (req, res) => {
    const { id, role } = req.user;

    try {
        let query;
        if (role === 'patient') {
            query = db.collection('appointments')
                .where('patient_id', '==', id)
                .orderBy('appointment_date', 'desc');
        } else if (role === 'doctor') {
            query = db.collection('appointments')
                .where('doctor_id', '==', id)
                .orderBy('appointment_date', 'desc');
        } else {
             return res.status(403).json({ message: 'Forbidden' });
        }

        const snapshot = await query.get();

        const appointmentsPromises = snapshot.docs.map(async (doc) => {
            const apptData = doc.data();
            let relatedUserName = 'N/A';

            try {
                if (role === 'patient' && apptData.doctor_id) {
                    const doctorDoc = await db.collection('users').doc(apptData.doctor_id).get();
                    if(doctorDoc.exists) relatedUserName = doctorDoc.data().name;
                } else if (role === 'doctor' && apptData.patient_id) {
                    const patientDoc = await db.collection('users').doc(apptData.patient_id).get();
                     if(patientDoc.exists) relatedUserName = patientDoc.data().name;
                }
            } catch (e) {
                console.error("Error fetching related user:", e);
            }


            return {
                id: doc.id,
                ...apptData,
                doctor_name: role === 'patient' ? relatedUserName : undefined,
                patient_name: role === 'doctor' ? relatedUserName : undefined,
            };
        });

        const appointments = await Promise.all(appointmentsPromises);
        res.json(appointments);

    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addAppointment = async (req, res) => {
    const { doctorId, date, reason } = req.body;
    const patientId = req.user.id;

    if (req.user.role !== 'patient') {
        return res.status(403).json({ message: 'Only patients can book appointments.' });
    }

    if (!doctorId || !date || !reason) {
        return res.status(400).json({ message: 'Doctor, date, and reason are required.' });
    }

    try {
        const newAppointment = {
            patient_id: patientId,
            doctor_id: doctorId,
            appointment_date: new Date(date).toISOString(),
            reason,
            status: 'confirmed', // Or 'pending' if you want a confirmation step
        };

        const docRef = await db.collection('appointments').add(newAppointment);
        const doc = await docRef.get();

        res.status(201).json({
            id: doc.id,
            ...doc.data()
        });

    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const snapshot = await db.collection('users').where('role', '==', 'doctor').get();
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No doctors found.' });
        }

        const doctors = snapshot.docs.map(doc => {
            const { password, ...doctorData } = doc.data();
            return {
                id: doc.id,
                ...doctorData
            };
        });
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
