const Question = require('../models/Question');


// 🔹 Create Question
exports.createQuestion = async (req, res) => {
  try {
    
    const { questionText, options, correctAnswerIndex, explanation, exam, subject, topic } = req.body;

    const question = await Question.create({
      questionText,
      options,
      correctAnswerIndex,
      explanation,
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
    console.error('Create Question Error:', error);  // Log full error on server

    res.status(500).json({
      success: false,
      message: 'Failed to create question',
      error: error.message || error.toString(),  // Send actual error message in response
      data: null,
    });
  }
};


// 🔹 Create Multiple Questions at Once
exports.bulkCreateQuestions = async (req, res) => {
  try {
    const questionsArray = req.body.questions;  // Array of question objects

    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions provided',
        data: null,
      });
    }

    // Insert all questions at once
    const createdQuestions = await Question.insertMany(questionsArray);

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
    const { questionText, options, correctAnswerIndex, explanation, exam, subject, topic } = req.body;

    const question = await Question.findByIdAndUpdate(
      id,
      { questionText, options, correctAnswerIndex, explanation, exam, subject, topic },
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
      data: null,
    });
  }
};


// GET /api/questions/filter?exam=examId&subject=subjectId&topic=topicId

exports.getQuestionsByFilter = async (req, res) => {
  try {
    const { exam, subject, topic } = req.query;

    const filter = {};
    if (exam) filter.exam = exam;
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;

    const questions = await Question.find(filter)
      .populate('exam')
      .populate('subject')
      .populate('topic');

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
