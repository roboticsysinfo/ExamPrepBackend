const { default: mongoose } = require('mongoose');
const Question = require('../models/Question');


// 🔹 Create Question
exports.createQuestion = async (req, res) => {
  try {
    const {
      instituteId,
      questionText,
      options,
      correctAnswerIndex,
      explanation,
      marks,
      difficulty,
      exam,
      subject,
      topic
    } = req.body;

    
    const question = await Question.create({
      instituteId,
      questionText,
      options,
      correctAnswerIndex,
      explanation,
      marks,
      difficulty,
      exam,
      subject,
      topic
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question,
    });
  } catch (error) {
    console.error('Create Question Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question',
      error: error.message || error.toString(),
      data: null,
    });
  }
};

// 🔹 Create Multiple Questions at Once
exports.bulkCreateQuestions = async (req, res) => {
  try {
    const questionsArray = req.body.questions;

    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions provided',
        data: null,
      });
    }

    const sanitizedQuestions = questionsArray.map(q => ({
      ...q,
      difficulty: q.difficulty || 'easy',
      marks: q.marks || 1
    }));

    const createdQuestions = await Question.insertMany(sanitizedQuestions);

    res.status(201).json({
      success: true,
      message: `${createdQuestions.length} questions created successfully`,
      data: createdQuestions,
    });
  } catch (error) {
    console.error('Bulk Create Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create multiple questions',
      error: error.message || error.toString(),
      data: null,
    });
  }
};

// 🔹 Update Question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      instituteId,
      questionText,
      options,
      correctAnswerIndex,
      explanation,
      marks,
      difficulty,
      exam,
      subject,
      topic
    } = req.body;

    const question = await Question.findByIdAndUpdate(
      id,
      {
        instituteId,
        questionText,
        options,
        correctAnswerIndex,
        explanation,
        marks,
        difficulty,
        exam,
        subject,
        topic
      },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update question',
      error: error.message,
      data: null,
    });
  }
};

// 🔹 Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully',
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
      error: error.message,
      data: null,
    });
  }
};

// 🔹 Get Question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('exam')
      .populate('subject')
      .populate('topic');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Question fetched successfully',
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question',
      error: error.message,
      data: null,
    });
  }
};

// 🔹 Get All Questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('exam')
      .populate('subject')
      .populate('topic');

    res.json({
      success: true,
      message: 'All questions fetched successfully',
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message,
      data: null,
    });
  }
};


// 🔹 Get Questions by Filter (only selected topic)
// exports.getQuestionsByFilter = async (req, res) => {
//   try {
//     // Destructure only the needed params (difficulty removed)
//     const { exam, subject, topic } = req.query;

//     const filter = {};

//     if (exam) filter.exam = exam;
//     if (subject) filter.subject = subject;

//     // Include only selected topic
//     if (topic) filter.topic = topic; // Assuming topic is string id, no need to convert explicitly if stored as string

//     const questions = await Question.find(filter)
//       .populate('exam')
//       .populate('subject')
//       .populate('topic');

//     res.status(200).json({
//       success: true,
//       message: 'Filtered questions fetched successfully',
//       data: questions
//     });
//   } catch (error) {
//     console.error('Error fetching questions by filter:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch questions',
//       error: error.message
//     });
//   }
// };


// 🔹 Get Questions by Filter (supports multiple topics)
exports.getQuestionsByFilter = async (req, res) => {
  try {
    const { exam, subject, topic } = req.query;

    const filter = {};

    if (exam?.trim()) filter.exam = exam;
    if (subject?.trim()) filter.subject = subject;

    // Allow multiple topics (comma-separated)
    if (topic?.trim()) {
      const topicArray = topic.split(',').map(t => t.trim());
      filter.topic = { $in: topicArray };
    }

    const questions = await Question.find(filter)
      .populate('exam', 'name')
      .populate('subject', 'name')
      .populate('topic', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Filtered questions fetched successfully',
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions by filter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
};



// 🔹 Get Questions by Institute ID
exports.getQuestionsByInstituteId = async (req, res) => {
  try {
    const { instituteId } = req.params;

    const questions = await Question.find({ instituteId })
      .populate('exam')
      .populate('subject')
      .populate('topic');

    res.status(200).json({
      success: true,
      message: `Questions for institute ${instituteId} fetched successfully`,
      data: questions,
    });
  } catch (error) {
    console.error('Error fetching questions by institute ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions by institute ID',
      error: error.message
    });
  }
};
