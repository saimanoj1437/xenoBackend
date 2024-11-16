const mongoose = require('mongoose');
const Customer = require('./models/Customer');  // Update the path based on where your Customer model is
const Order = require('./models/Order');  // Update the path based on where your Order model is

// Connect to the database
mongoose.connect('mongodb://localhost:27017/xeno-crm', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...', err));

// Sample customer data
const sampleCustomers = [
    { name: 'John Doe', email: 'johndoe@example.com', totalSpending: 12000, visits: 5 },
    { name: 'Jane Smith', email: 'janesmith@example.com', totalSpending: 8000, visits: 2 },
    { name: 'Jack Black', email: 'jackblack@example.com', totalSpending: 5000, visits: 8 },
];

// Sample order data
const sampleOrders = [
    { customerId: null, product: 'Product 1', quantity: 2, price: 100, orderDate: new Date() },
    { customerId: null, product: 'Product 2', quantity: 1, price: 50, orderDate: new Date() },
    { customerId: null, product: 'Product 3', quantity: 5, price: 200, orderDate: new Date() },
];

// Add customers to the database
const addCustomers = async () => {
    try {
        const customers = await Customer.insertMany(sampleCustomers);
        console.log('Sample Customers added:', customers);

        // Link sample orders to customers
        sampleOrders[0].customerId = customers[0]._id;
        sampleOrders[1].customerId = customers[1]._id;
        sampleOrders[2].customerId = customers[2]._id;

        // Add orders to the database
        const orders = await Order.insertMany(sampleOrders);
        console.log('Sample Orders added:', orders);
    } catch (err) {
        console.error('Error adding data:', err);
    } finally {
        mongoose.disconnect();  // Disconnect after the operation
    }
};

addCustomers();
