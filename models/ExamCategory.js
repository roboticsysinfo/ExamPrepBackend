// models/ExamCategory.js
const mongoose = require('mongoose');

const examCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    e_category_img: {
        type: String,
        default: "https://placehold.co/600x400/png"
    }
});

module.exports = mongoose.model('ExamCategory', examCategorySchema);
