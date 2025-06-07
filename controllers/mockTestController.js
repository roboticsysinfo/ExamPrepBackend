const MockTest = require('../models/MockTest');

// 🔹 Create Mock Test
exports.createTest = async (req, res) => {
  try {
    const {
      instituteId,
      title,
      exam,
      subject,
      topic,
      questions,
      duration = 30,
      totalMarks,
      isPaid = false,
      price = 0
    } = req.body;

    const test = await MockTest.create({
      instituteId,
      title,
      exam,
      subject,
      topic,
      questions,
      duration,
      totalMarks,
      isPaid,
      price
    });

    res.status(201).json({
      success: true,
      message: 'Mock test created successfully',
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create mock test',
      error: error.message
    });
  }
};

// 🔹 Update Mock Test
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      exam,
      subject,
      topic,
      questions,
      duration,
      totalMarks,
      isPaid,
      price
    } = req.body;

    const updatedTest = await MockTest.findByIdAndUpdate(
      id,
      {
        title,
        exam,
        subject,
        topic,
        questions,
        duration,
        totalMarks,
        isPaid,
        price
      },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found'
      });
    }

    res.json({
      success: true,
      message: 'Mock test updated successfully',
      data: updatedTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update mock test',
      error: error.message
    });
  }
};

// 🔹 Delete Mock Test
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTest = await MockTest.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found'
      });
    }

    res.json({
      success: true,
      message: 'Mock test deleted successfully',
      data: deletedTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete mock test',
      error: error.message
    });
  }
};

// 🔹 Get Mock Test by ID
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await MockTest.findById(id)
      .populate('exam')
      .populate('subject')
      .populate('topic')
      .populate('questions');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found'
      });
    }

    res.json({
      success: true,
      message: 'Mock test fetched successfully',
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mock test',
      error: error.message
    });
  }
};

// 🔹 Get All Mock Tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await MockTest.find()
      .populate('exam')
      .populate('subject')
      .populate('topic')
      .populate('questions');

    res.json({
      success: true,
      message: 'All mock tests fetched successfully',
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mock tests',
      error: error.message
    });
  }
};


// 🔹 Get Mock Tests by Institute ID
exports.getMockTestsByInstituteId = async (req, res) => {
  try {
    const { instituteId } = req.params;

    const tests = await MockTest.find({ instituteId })
      .populate('exam')
      .populate('subject')
      .populate('topic')
      .populate('questions');

    res.json({
      success: true,
      message: 'Mock tests fetched successfully',
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mock tests',
      error: error.message
    });
  }
};


// 🔍 Search Mock Tests by Title
exports.searchMockTests = async (req, res) => {
  try {
    const { instituteId, search = '' } = req.query;

    const query = {
      title: { $regex: search, $options: 'i' } // case-insensitive search
    };

    if (instituteId) {
      query.instituteId = instituteId;
    }

    const tests = await MockTest.find(query)
      .populate('exam')
      .populate('subject')
      .populate('topic');

    res.json({
      success: true,
      message: 'Search results fetched successfully',
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

// 🧮 Filter Mock Tests

exports.filterMockTests = async (req, res) => {
  try {
    const { instituteId, categoryId, examId, subjectId, topicId } = req.query;

    const query = {};

    if (instituteId) query.instituteId = instituteId;
    if (examId) query.exam = examId;
    if (subjectId) query.subject = subjectId;
    if (topicId) query.topic = topicId;

    // if categoryId provided, find exams under it
    if (categoryId) {
      const Exam = require('../models/Exam');
      const exams = await Exam.find({ examCategoryId: categoryId }).select('_id');
      const examIds = exams.map(exam => exam._id);
      query.exam = { $in: examIds };
    }

    const tests = await MockTest.find(query)
      .populate('exam')
      .populate('subject')
      .populate('topic');

    res.json({
      success: true,
      message: 'Filtered mock tests fetched successfully',
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to filter mock tests',
      error: error.message
    });
  }
};
