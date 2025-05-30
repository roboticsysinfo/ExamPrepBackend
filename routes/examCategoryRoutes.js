const express = require('express');
const router = express.Router();
const {
    createExamCategory,
    getAllExamCategories,
    getExamCategoryById,
    updateExamCategory,
    deleteExamCategory
} = require('../controllers/examCategoryController');
const upload = require("../middlewares/uploads")


// Create category
router.post('/create-exam-category', upload.single('e_category_img'), createExamCategory);

// Get all categories
router.get('/exam-categories', getAllExamCategories);

// Update category
router.put('/update/examCategory/:id', upload.single('e_category_img'), updateExamCategory);

// Delete category
router.delete('/delete/examCategory:id', deleteExamCategory);

module.exports = router;
