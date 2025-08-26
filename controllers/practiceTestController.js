const PracticeTest = require('../models/PracticeTest');
const PracticeTestResult = require('../models/PracticeTestResult');
const Student = require('../models/StudentModel');


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
      .populate('questions') // 🔥 Add this line to get full question details
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
    const { difficulty } = req.query; // ✅ difficulty via query param

    if (!topicId) {
      return res.status(400).json({ success: false, message: 'TopicId is required' });
    }

    const test = await PracticeTest.findOne({ topic: topicId })
      .populate({
        path: 'exam subject topic',
      })
      .populate({
        path: 'questions',
        match: difficulty ? { difficulty } : {}, // ✅ filter questions if difficulty given
      });

    if (!test) {
      return res.status(404).json({ success: false, message: 'Practice test not found for this topic' });
    }

    // ❗ If no questions match the difficulty
    if (difficulty && (!test.questions || test.questions.length === 0)) {
      return res.status(404).json({
        success: false,
        message: `No questions found for topic with difficulty "${difficulty}"`,
      });
    }

    return res.json({ success: true, data: test });
  } catch (error) {
    console.error('Error fetching practice test:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// submit test answers
exports.submitPracticeTestAnswers = async (req, res) => {
  try {
    const { testId, studentId, answers, timeTaken } = req.body;

    const test = await PracticeTest.findById(testId).populate('questions');
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

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
    const score = correct * 1; // or use test.markPerQuestion if available

    // ✅ Save practice test result
    const result = await PracticeTestResult.create({
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

    // ✅ Update student scores
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const updatedPracticeTestScore = (student.practiceTestScore || 0) + score;
    const updatedMockTestScore = student.mockTestScore || 0;
    const updatedOverallScore = updatedPracticeTestScore + updatedMockTestScore;

    student.practiceTestScore = updatedPracticeTestScore;
    student.overallScore = updatedOverallScore;

    await student.save();

    // ✅ Send response
    res.json({
      success: true,
      message: 'Test submitted successfully.',
      resultId: result._id
    });

  } catch (err) {
    console.error('Error submitting practice test:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get Practice test Result by Result ID
exports.getPracticeTestResultById = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await PracticeTestResult.findById(resultId)
      .populate('testId', 'title exam subject topic')
      .populate('studentId', 'name');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Practice test result not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Practice test result fetched successfully',
      data: result,
    });

  } catch (error) {
    console.error('Error fetching Practice test result:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching Practice test result',
      data: null,
    });
  }
};


// Get Practice Test History by Student ID
exports.getPracticeTestHistoryByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required',
      });
    }

    const results = await PracticeTestResult.find({ studentId })
      .populate({
        path: 'testId',
        select: 'title topic totalMarks duration',
        populate: [
          { path: 'exam', select: 'name' },
          { path: 'subject', select: 'name' },
        ],
      })
      .populate({
        path: 'answers.questionId',   // populate questionId inside answers array
        select: 'questionText'        // only questionText field
      })
      .sort({ submittedAt: -1 }); // latest first

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No practice test history found for this student',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: 'Practice test history fetched successfully',
      data: results,
    });

  } catch (error) {
    console.error('Error fetching practice test history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching practice test history',
    });
  }
};

// get practice test by exam
exports.getPracticeTestsByExamId = async (req, res) => {
  try {
    const { examId } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build query
    let query = { exam: examId };
    if (search && search.trim() !== "") {
      query.title = { $regex: search, $options: "i" }; // case-insensitive search
    }

    // Fetch data with pagination
    const practiceTests = await PracticeTest.find(query)
      .populate("exam", "name")
      .populate("subject", "name")
      .populate("topic", "name")
      .populate("questions")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await PracticeTest.countDocuments(query);

    if (!practiceTests || practiceTests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No practice tests found for this exam",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Practice tests fetched successfully",
      data: practiceTests,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        hasMore: pageNumber * limitNumber < total,
      },
    });
  } catch (error) {
    console.error("Error fetching practice tests by examId:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
