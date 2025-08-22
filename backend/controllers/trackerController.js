const { db } = require('../config/firebase');

exports.getLogs = async (req, res) => {
    const userId = req.user.id;
    try {
        const snapshot = await db.collection('menstrual_logs')
                                 .where('user_id', '==', userId)
                                 .orderBy('start_date', 'desc')
                                 .get();
        
        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(logs);
    } catch (error) {
        console.error('Error fetching menstrual logs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addLog = async (req, res) => {
    const { start_date, end_date } = req.body;
    const userId = req.user.id;

    if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Start date and end date are required' });
    }

    try {
        const newLog = {
            user_id: userId,
            start_date,
            end_date
        };
        
        const docRef = await db.collection('menstrual_logs').add(newLog);
        const doc = await docRef.get();

        res.status(201).json({
            id: doc.id,
            ...doc.data()
        });
    } catch (error)
    {
        console.error('Error adding menstrual log:', error);
        res.status(500).json({ message: 'Server error' });
    }
};