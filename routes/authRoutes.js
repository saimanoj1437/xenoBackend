// backend/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Import User model
const router = express.Router();

// Google OAuth client setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Make sure to set your Google Client ID in .env

// Signup Route (Storing Password as Plaintext)
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log("Received signup request with email:", email);

        // Create a new user with the plaintext password
        const newUser = new User({ email, password }); // Store password as plaintext (no hashing)

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error in signup route:", error);
        res.status(500).json({ message: 'User already Existed' });
    }
});

// Google Sign-In Route
router.post('/google-signin', async (req, res) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email } = ticket.getPayload();

        // Check if user exists; if not, create a new user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, password: null }); // Password can be null for Google sign-ins
            await user.save();
        }

        // Generate JWT token for Google login
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ message: 'Google sign-in successful', token });
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        res.status(500).json({ message: 'Error during Google sign-in', error });
    }
});

// authRoutes.js
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Send the token and user data (email) in response
        return res.json({
            message: 'Login successful',
            token: token,
            user: { email: user.email }, // Send user data
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Error logging in', error: err });
    }
});


module.exports = router;