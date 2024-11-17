const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); 
const router = express.Router();


const client = new OAuth2Client('512414783784-34hoe7s2p0nnt3p9kkpcls7iqjrc534v.apps.googleusercontent.com'); 


router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

       
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        console.log("Received signup request with email:", email);

   
        const newUser = new User({ email, password }); 

        
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error in signup route:", error);
        res.status(500).json({ message: 'User already Existed' });
    }
});


router.post('/google-signin', async (req, res) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: '512414783784-34hoe7s2p0nnt3p9kkpcls7iqjrc534v.apps.googleusercontent.com',
        });

        const { email } = ticket.getPayload();

        
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, password: null }); 
            await user.save();
        }

     
        const token = jwt.sign({ userId: user._id }, '704337e37f0d200f2cb37b2ad4d328d9610d96c52fe7ea3665d74dd90133e9517281b00eb6ffe51c7d570989da6d9d7ac95661155e8734d29ac26bc834d9ed42', { expiresIn: '1h' });

        res.json({ message: 'Google sign-in successful', token });
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        res.status(500).json({ message: 'Error during Google sign-in', error });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
       
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

      
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

    
        const token = jwt.sign({ userId: user._id }, '704337e37f0d200f2cb37b2ad4d328d9610d96c52fe7ea3665d74dd90133e9517281b00eb6ffe51c7d570989da6d9d7ac95661155e8734d29ac26bc834d9ed42', { expiresIn: '1h' });

        return res.json({
            message: 'Login successful',
            token: token,
            user: { email: user.email },
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Error logging in', error: err });
    }
});

module.exports = router;
