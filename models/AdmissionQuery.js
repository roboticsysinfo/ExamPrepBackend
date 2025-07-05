// models/AdmissionQuery.js
const mongoose = require('mongoose');

const admissionQuerySchema = new mongoose.Schema({
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Institute'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true
    },
    motherName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    
    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    gender: { type: String, required: true },

    dob: { type: String, required: true },

    village: { type: String },

    profileImage: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('AdmissionQuery', admissionQuerySchema);
