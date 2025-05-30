const ExamCategory = require('../models/ExamCategory');


// Create Exam Category
exports.createExamCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        let e_category_img = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : "https://placehold.co/600x400/png";

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const newCategory = await ExamCategory.create({
            name,
            description,
            e_category_img
        });

        return res.status(201).json({
            success: true,
            message: "Exam category created successfully",
            data: newCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};


// Get all Exam Categories
exports.getAllExamCategories = async (req, res) => {
    try {
        const categories = await ExamCategory.find();

        res.status(200).json({
            success: true,
            message: "All exam categories fetched successfully",
            data: categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};


// Get Exam Category by ID
exports.getExamCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await ExamCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Exam category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Exam category fetched successfully",
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};


// Update Exam Category
exports.updateExamCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        let updates = { name, description };

        if (req.file) {
            updates.e_category_img = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const updatedCategory = await ExamCategory.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Exam category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Exam category updated successfully",
            data: updatedCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};


// Delete Exam Category
exports.deleteExamCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await ExamCategory.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Exam category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Exam category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};
