// models/PreviousQuestionPaper.js
const mongoose = require('mongoose');

const previousQuestionPaperSchema = new mongoose.Schema({

    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute', required: true
    },

    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam', required: true
    },

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject', required: true
    },

    title: {
        type: String, required: true
    },   // Example: "Math Paper 2023"

    year: {
        type: Number, required: true
    },  

    fileUrl: {
        type: String, required: true
    }, // Stored file URL/path

    uploadedAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('PreviousQuestionPaper', previousQuestionPaperSchema);
