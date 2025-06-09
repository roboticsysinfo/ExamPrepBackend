const Doubt = require('../models/Doubts');

// ✅ 1. Submit Doubt
exports.submitDoubt = async (req, res) => {

  try {

    const { studentId, exam, subject, topic, question } = req.body;

    const newDoubt = new Doubt({ studentId, exam, subject, topic, question });
    await newDoubt.save();

    res.status(201).json({
      success: true,
      message: 'Doubt submitted successfully',
      data: newDoubt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit doubt',
      error: error.message
    });
  }
};

// ✅ 2. Get All Doubts
exports.getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate('studentId', 'name email instituteId')
      .populate('answeredBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All doubts fetched successfully',
      data: doubts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doubts',
      error: error.message
    });
  }
};

// ✅ 3. Get Doubts by Institute ID
exports.getDoubtsByInstituteId = async (req, res) => {
  try {
    const { instituteId } = req.params;

    const doubts = await Doubt.find()
      .populate({
        path: 'studentId',
        match: { instituteId: instituteId }
      })
      .populate('answeredBy', 'name email')
      .sort({ createdAt: -1 });

    const filteredDoubts = doubts.filter(d => d.studentId !== null);

    res.status(200).json({
      success: true,
      message: 'Doubts fetched by institute ID successfully',
      data: filteredDoubts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doubts by institute',
      error: error.message
    });
  }
};

// ✅ 4. Answer Doubt
exports.answerDoubt = async (req, res) => {
  try {
    const { answer, answeredBy } = req.body;
    const { doubtId } = req.params;

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found',
        error: 'Invalid doubt ID'
      });
    }

    doubt.answer = answer;
    doubt.answeredBy = answeredBy;
    doubt.status = 'answered';
    await doubt.save();

    res.status(200).json({
      success: true,
      message: 'Doubt answered successfully',
      data: doubt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to answer doubt',
      error: error.message
    });
  }
};

// ✅ 5. Get Doubts by Student ID
exports.getDoubtsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const doubts = await Doubt.find({ studentId })
      .populate('answeredBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Doubts fetched for student successfully',
      data: doubts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student doubts',
      error: error.message
    });
  }
};
