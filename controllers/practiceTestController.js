const PracticeTest = require('../models/PracticeTest');


// Create Practice Test
exports.createPracticeTest = async (req, res) => {
  try {
    const data = req.body;
    const practiceTest = new PracticeTest(data);
    await practiceTest.save();
    res.status(201).json({
      success: true,
      data: practiceTest,
      message: 'Practice test created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to create practice test',
    });
  }
};

// Get Practice Test by ID
exports.getPracticeTestById = async (req, res) => {
  try {
    const practiceTest = await PracticeTest.findById(req.params.id)
      .populate('instituteId exam subject topic questions');
    if (!practiceTest) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Practice test not found',
      });
    }
    res.json({
      success: true,
      data: practiceTest,
      message: 'Practice test retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to fetch practice test',
    });
  }
};

// Get Practice Tests by Institute ID
exports.getPracticeTestsByInstituteId = async (req, res) => {
  try {
    const instituteId = req.params.instituteId;
    const tests = await PracticeTest.find({ instituteId })
      .populate('exam subject topic')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: tests,
      message: 'Practice tests fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to fetch practice tests',
    });
  }
};

// Update Practice Test by ID
exports.updatePracticeTest = async (req, res) => {
  try {
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();

    const updatedTest = await PracticeTest.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Practice test not found',
      });
    }

    res.json({
      success: true,
      data: updatedTest,
      message: 'Practice test updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to update practice test',
    });
  }
};

// Delete Practice Test by ID
exports.deletePracticeTest = async (req, res) => {
  try {
    const deletedTest = await PracticeTest.findByIdAndDelete(req.params.id);
    if (!deletedTest) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Practice test not found',
      });
    }
    res.json({
      success: true,
      data: null,
      message: 'Practice test deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to delete practice test',
    });
  }
};


// Get All Practice Tests (without filtering by institute)
exports.getAllPracticeTests = async (req, res) => {
  try {
    const tests = await PracticeTest.find()
      .populate('instituteId exam subject topic')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tests,
      message: 'All practice tests fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to fetch practice tests',
    });
  }
};


exports.getPracticeTestByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    if (!topicId) {
      return res.status(400).json({ success: false, message: 'TopicId is required' });
    }

    // Practice test topic के आधार पर fetch करो
    // अगर difficulty भी add है तो filter कर सकते हैं: { topic: topicId, difficulty: req.query.difficulty }
    const test = await PracticeTest.findOne({ topic: topicId })
      .populate('exam subject topic questions'); // related data भी लाओ

    if (!test) {
      return res.status(404).json({ success: false, message: 'Practice test not found for this topic' });
    }

    return res.json({ success: true, data: test });
  } catch (error) {
    console.error('Error fetching practice test:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};