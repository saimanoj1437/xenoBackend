// routes/audienceRoutes.js
const express = require('express');
const Audience = require('../models/Audience'); // Import Audience model
const router = express.Router();

// POST route to add an audience
router.post('/add', async (req, res) => {
    try {
        const audience = new Audience(req.body); // Create a new Audience instance with data from request body
        await audience.save(); // Save the audience data to MongoDB
        res.status(201).send(audience); // Respond with the saved audience data
    } catch (error) {
        res.status(400).send(error); // Handle errors by sending a 400 status code
    }
});

router.get('/', async (req, res) => {
    try {
        const audiences = await Audience.find(); // Fetch all audiences from MongoDB
        res.status(200).send(audiences); // Respond with the list of audiences
    } catch (error) {
        res.status(500).send(error); // Handle errors by sending a 500 status code
    }
});

module.exports = router;
