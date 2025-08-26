const MockTest = require('../models/MockTest');
const MockTestResult = require('../models/MockTestResult');
const Student = require("../models/StudentModel")

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

// submit test answers


exports.submitMockTestAnswers = async (req, res) => {
  try {
    const { testId, studentId, answers, timeTaken } = req.body;

    const test = await MockTest.findById(testId).populate('questions');
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    const results = [];
    let correct = 0;

    for (const q of test.questions) {
      const selected = answers[q._id] || null;
      const correctOption = q.options[q.correctAnswerIndex];
      const isCorrect = selected === correctOption;

      if (selected) {
        if (isCorrect) correct++;
        results.push({
          questionId: q._id,
          selectedOption: selected,
          correctOption,
          isCorrect
        });
      }
    }

    const attempted = Object.keys(answers).length;
    const wrong = attempted - correct;
    const score = correct * 1;

    const result = await MockTestResult.create({
      testId,
      studentId,
      totalQuestions: test.questions.length,
      attempted,
      correct,
      wrong,
      score,
      answers: results,
      timeTaken
    });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const updatedMockTestScore = (student.mockTestScore || 0) + score;
    const updatedOverallScore = (student.practiceTestScore || 0) + updatedMockTestScore;

    student.mockTestScore = updatedMockTestScore;
    student.overallScore = updatedOverallScore;
    await student.save();

    res.json({
      success: true,
      message: 'Test submitted successfully.',
      resultId: result._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};




// Get Mock test Result by Result ID
exports.getMockTestResultById = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await MockTestResult.findById(resultId)
      .populate('testId', 'title exam subject topic')
      .populate('studentId', 'name');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Mock test result not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mock test result fetched successfully',
      data: result,
    });

  } catch (error) {
    console.error('Error fetching mock test result:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching mock test result',
      data: null,
    });
  }
};


// 🔹 Get Mock Test History by Student ID
exports.getMockTestHistoryByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const history = await MockTestResult.find({ studentId })
      .populate({
        path: 'testId',
        select: 'title topic totalMarks duration',
        populate: [
          { path: 'exam', select: 'name' },
          { path: 'subject', select: 'name' },
        ],
      })
      .populate({
        path: 'answers.questionId',   // populate nested questionId inside answers array
        select: 'questionText'        // get only questionText field from Question
      })
      .sort({ submittedAt: -1 });

    if (!history || history.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No mock test history found for this student',
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mock test history fetched successfully',
      data: history
    });

  } catch (error) {
    console.error('Error fetching mock test history:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching mock test history',
      data: null
    });
  }
};

// get mock test by exam id

exports.getMockTestsByExamId = async (req, res) => {
  try {
    const { examId } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    // Pagination calculations
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build query
    let query = { exam: examId };
    if (search && search.trim() !== "") {
      query.title = { $regex: search, $options: "i" }; // case-insensitive
    }

    // Fetch data with pagination
    const mockTests = await MockTest.find(query)
      .populate("exam", "name")
      .populate("subject", "name")
      .populate("topic", "name")
      .populate("questions")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 }); // latest first (optional)

    // Get total count for pagination info
    const total = await MockTest.countDocuments(query);

    if (!mockTests || mockTests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No mock tests found for this exam",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mock tests fetched successfully",
      data: mockTests,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        hasMore: pageNumber * limitNumber < total,
      },
    });
  } catch (error) {
    console.error("Error fetching mock tests by examId:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




