// server/models/Audience.js
const mongoose = require('mongoose');

const AudienceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    totalSpending: { type: Number, required: true },
    visits: { type: Number, required: true },
    lastVisitDate: { type: Date, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true }
});

module.exports = mongoose.model('Audience', AudienceSchema);
