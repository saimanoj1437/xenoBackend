const express = require('express');
const Audience = require('../models/Audience'); 
const router = express.Router();


router.post('/add', async (req, res) => {
    try {
        const audience = new Audience(req.body); 
        await audience.save(); 
        res.status(201).send(audience); 
    } catch (error) {
        res.status(400).send(error); 
    }
});

router.get('/', async (req, res) => {
    try {
        const audiences = await Audience.find(); 
        res.status(200).send(audiences); 
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
