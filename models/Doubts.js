

const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    exam: { type: String, required: true },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'answered'],
        default: 'pending'
    },
    answer: String,
    answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Doubt', doubtSchema);

