const Test = require('../models/Test');

// 🔹 Create Test
exports.createTest = async (req, res) => {
  try {
    const {
      title,
      exam,
      subject,
      topic,
      questions,
      difficulty = 'easy',
      duration = 30,
      totalMarks
    } = req.body;

    const test = await Test.create({
      title,
      exam,
      subject,
      topic,
      questions,
      difficulty,
      duration,
      totalMarks
    });

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create test',
      error: error.message
    });
  }
};

// 🔹 Update Test
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      exam,
      subject,
      topic,
      questions,
      difficulty,
      duration,
      totalMarks
    } = req.body;

    const updatedTest = await Test.findByIdAndUpdate(
      id,
      {
        title,
        exam,
        subject,
        topic,
        questions,
        difficulty,
        duration,
        totalMarks
      },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      message: 'Test updated successfully',
      data: updatedTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update test',
      error: error.message
    });
  }
};

// 🔹 Delete Test
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTest = await Test.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      message: 'Test deleted successfully',
      data: deletedTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete test',
      error: error.message
    });
  }
};

// 🔹 Get Test by ID
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findById(id)
      .populate('exam')
      .populate('subject')
      .populate('topic')
      .populate('questions');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      message: 'Test fetched successfully',
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test',
      error: error.message
    });
  }
};

// 🔹 Get All Tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .populate('exam')
      .populate('subject')
      .populate('topic')
      .populate('questions');

    res.json({
      success: true,
      message: 'All tests fetched successfully',
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests',
      error: error.message
    });
  }
};
