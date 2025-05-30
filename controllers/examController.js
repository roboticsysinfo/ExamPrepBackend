const Exam = require('../models/Exam');


// ✅ Create Exam
exports.createExam = async (req, res) => {
  try {
    const { name, description, examCategory } = req.body;

    if (!name || !examCategory) {
      return res.status(400).json({
        success: false,
        message: 'Name and exam category are required',
        data: null
      });
    }

    const examImage = req.file ? req.file.filename : undefined;

    const exam = await Exam.create({
      name,
      description,
      examCategory,
      examImage
    });

    const populatedExam = await exam.populate('examCategory');

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: populatedExam
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create exam',
      data: null
    });
  }
};


// ✅ Update Exam
exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, examCategory } = req.body;
    const examImage = req.file ? req.file.filename : undefined;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (examCategory) updateData.examCategory = examCategory;
    if (examImage) updateData.examImage = examImage;

    const exam = await Exam.findByIdAndUpdate(id, updateData, {
      new: true
    }).populate('examCategory');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Exam updated successfully',
      data: exam
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update exam',
      data: null
    });
  }
};

// ✅ Delete Exam
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Exam deleted successfully',
      data: exam
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete exam',
      data: null
    });
  }
};

// ✅ Get Single Exam
exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id).populate('examCategory');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Exam fetched successfully',
      data: exam
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exam',
      data: null
    });
  }
};

// ✅ Get All Exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .sort({ createdAt: -1 })
      .populate('examCategory');

    res.json({
      success: true,
      message: 'All exams fetched successfully',
      data: exams
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exams',
      data: null
    });
  }
};
