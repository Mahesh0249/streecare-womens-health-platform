// Initialize Firebase Admin SDK
require('./config/firebase');

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const appointmentRoutes = require('./routes/appointments');
const forumRoutes = require('./routes/forum');
const trackerRoutes = require('./routes/tracker');
const musicRoutes = require('./routes/music');
const meetingsRoutes = require('./routes/meetings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the StreeCare API' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/menstrual', trackerRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/meetings', meetingsRoutes);

// Error handling middleware (catch-all for unhandled errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));