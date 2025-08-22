const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
const { JWT_SECRET } = require('../config/secrets');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Get user from Firestore using the ID from the token
            const userDoc = await db.collection('users').doc(decoded.id).get();
            
            if (!userDoc.exists) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            // Exclude password from the user object attached to the request
            const { password, ...userData } = userDoc.data();

            req.user = {
                id: userDoc.id,
                ...userData
            };
            
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
