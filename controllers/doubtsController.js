const Doubt = require('../models/Doubts');
const Notification = require('../models/Notification');

// ✅ 1. Submit Doubt
exports.submitDoubt = async (req, res) => {
  try {

    const { instituteId, studentId, exam, subject, topic, question } = req.body;

    // instituteId is now required
    if (!instituteId) {
      return res.status(400).json({
        success: false,
        message: 'Institute ID is required',
      });
    }

    const newDoubt = new Doubt({ instituteId, studentId, exam, subject, topic, question });
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
      .populate('exam', 'name')      // ✅ Get exam name
      .populate('subject', 'name')   // ✅ Get subject name
      .populate('topic', 'name')     // ✅ Get topic name
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
// exports.answerDoubt = async (req, res) => {
//   try {
//     const { answer, answeredBy } = req.body;
//     const { doubtId } = req.params;

//     const doubt = await Doubt.findById(doubtId);
//     if (!doubt) {
//       return res.status(404).json({
//         success: false,
//         message: 'Doubt not found',
//         error: 'Invalid doubt ID'
//       });
//     }

//     doubt.answer = answer;
//     doubt.answeredBy = answeredBy;
//     doubt.status = 'answered';
//     await doubt.save();

//     res.status(200).json({
//       success: true,
//       message: 'Doubt answered successfully',
//       data: doubt
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to answer doubt',
//       error: error.message
//     });
//   }
// };

exports.answerDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;
    const { answer, answeredBy } = req.body;

    const updatedDoubt = await Doubt.findByIdAndUpdate(
      doubtId,
      { answer, answeredBy, status: 'answered' },
      { new: true }
    ).populate('studentId instituteId');

    // ✅ Send notification to student after answer
    await Notification.create({
      userId: updatedDoubt.studentId._id,
      instituteId: updatedDoubt.instituteId._id,
      type: 'answered',
      title: 'Your doubt has been answered!',
      message: `Answer: ${updatedDoubt.answer}`
    });

    res.status(200).json({
      success: true,
      message: 'Doubt answered successfully',
      data: updatedDoubt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error answering doubt', error: error.message });
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
