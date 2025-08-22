const { db } = require('../config/firebase');

exports.getSummary = async (req, res) => {
    const { id, role } = req.user;

    try {
        if (role === 'patient') {
            const now = new Date();

            // Get next appointment
            const appointmentsSnapshot = await db.collection('appointments')
                .where('patient_id', '==', id)
                .where('appointment_date', '>=', now.toISOString())
                .orderBy('appointment_date', 'asc')
                .limit(1)
                .get();

            let nextAppointment = null;
            if (!appointmentsSnapshot.empty) {
                const apptDoc = appointmentsSnapshot.docs[0];
                const apptData = apptDoc.data();
                
                // Fetch doctor details
                const doctorDoc = await db.collection('users').doc(apptData.doctor_id).get();
                const doctorName = doctorDoc.exists ? doctorDoc.data().name : 'N/A';
                
                nextAppointment = { 
                    id: apptDoc.id, 
                    ...apptData,
                    doctor_name: doctorName
                };
            }

            // Get last period
            const trackerSnapshot = await db.collection('menstrual_logs')
                .where('user_id', '==', id)
                .orderBy('start_date', 'desc')
                .limit(1)
                .get();

            const lastPeriodStart = trackerSnapshot.empty ? null : trackerSnapshot.docs[0].data().start_date;

            return res.json({
                nextAppointment: nextAppointment,
                lastPeriodStart: lastPeriodStart,
            });

        } else if (role === 'doctor') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const appointmentsSnapshot = await db.collection('appointments')
                .where('doctor_id', '==', id)
                .where('appointment_date', '>=', today.toISOString())
                .where('appointment_date', '<', tomorrow.toISOString())
                .orderBy('appointment_date', 'asc')
                .get();

            const appointmentsPromises = appointmentsSnapshot.docs.map(async (doc) => {
                const apptData = doc.data();
                const patientDoc = await db.collection('users').doc(apptData.patient_id).get();
                const patientName = patientDoc.exists ? patientDoc.data().name : 'N/A';
                return {
                    id: doc.id,
                    ...apptData,
                    patient_name: patientName,
                };
            });
            
            const todaysAppointments = await Promise.all(appointmentsPromises);
            
            return res.json({ todaysAppointments });
        }
        
        return res.status(403).json({ message: 'Forbidden' });

    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ message: 'Server error' });
    }
};