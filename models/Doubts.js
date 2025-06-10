

const mongoose = require('mongoose');


const doubtSchema = new mongoose.Schema({
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Institute'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam', // ✅ Add ref here
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject', // ✅ Add ref here
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic', // ✅ Add ref here
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

