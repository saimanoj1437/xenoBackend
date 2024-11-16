// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const audienceRoutes = require('./routes/customer'); // Import audience routes
require('dotenv').config();

const app = express();

// Use CORS middleware
app.use(cors({
    origin: 'https://xeno-frontend-liard.vercel.app/',  // Allow requests from frontend
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}));

app.use(express.json()); // Parse JSON requests

// Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 3600000
    }
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => console.log('MongoDB connected successfully.'));
mongoose.connection.on('error', (err) => console.log('MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected.'));

// Register routes
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes); // Add auth routes
app.use('/api/audience', audienceRoutes); // Add audience routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
