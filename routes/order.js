const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');


router.post('/', authenticate, async (req, res) => {
    const { customerId, items, totalAmount } = req.body;

    
    if (!customerId || !items || !totalAmount) {
        return res.status(400).json({ error: 'Missing required fields: customerId, items, or totalAmount' });
    }

    try {
        const newOrder = new Order({ customerId, items, totalAmount });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create order', message: error.message });
    }
});


router.get('/', authenticate, async (req, res) => {
    try {
        const orders = await Order.find().populate('customerId', 'name'); // populate customer name
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
    }
});


router.get('/:id', authenticate, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customerId', 'name');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order', message: error.message });
    }
});

// Update an order by ID
router.put('/:id', authenticate, async (req, res) => {
    const { items, totalAmount } = req.body;

    // Validation
    if (!items || !totalAmount) {
        return res.status(400).json({ error: 'Missing required fields: items or totalAmount' });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { items, totalAmount },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update order', message: error.message });
    }
});


router.delete('/:id', authenticate, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order', message: error.message });
    }
});

module.exports = router;
