const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

router.post('/add', async (req, res) => {
    try {
        const { name, email, totalSpending, visits, lastVisitDate } = req.body;
        const newCustomer = new Customer({ name, email, totalSpending, visits, lastVisitDate });
        await newCustomer.save();
        res.status(201).json({ message: 'Customer added successfully!', customer: newCustomer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding customer' });
    }
});

module.exports = router;
