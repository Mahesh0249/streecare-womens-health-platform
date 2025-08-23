const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
const { JWT_SECRET } = require('../config/secrets');

exports.protect = async (req, res, next) => {
    let token;

    console.log('JWT_SECRET in authMiddleware:', JWT_SECRET); // Debugging line

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
            console.log('req.user after authentication:', req.user); // Debugging line
            
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.error('No token provided in authorization header.');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
