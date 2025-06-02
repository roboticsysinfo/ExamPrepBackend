// models/Institute.js
const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    instituteRegNumber: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Institute', instituteSchema);
