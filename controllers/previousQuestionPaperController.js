const fs = require('fs');
const path = require('path');
const PreviousQuestionPaper = require('../models/PreviousQuestionPaper');

exports.uploadPreviousQuestionPaper = async (req, res) => {
  try {
    const { instituteId, examId, subjectId, title, year } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    const fileUrl = req.file.path;

    const paper = new PreviousQuestionPaper({
      instituteId,
      examId,
      subjectId,
      title,
      fileUrl,
      year
    });

    await paper.save();

    res.status(201).json({
      success: true,
      message: 'Previous question paper uploaded successfully',
      data: paper,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.getPreviousQuestionPapers = async (req, res) => {
  try {
    const papers = await PreviousQuestionPaper.find()
      .populate('instituteId', 'name')
      .populate('examId', 'name')
      .populate('subjectId', 'name')
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Previous question papers fetched successfully',
      data: papers,
    });
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.getPreviousQuestionPapersBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const papers = await PreviousQuestionPaper.find({ subjectId })
      .populate('instituteId', 'name')
      .populate('examId', 'name')
      .populate('subjectId', 'name')
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      message: `Previous question papers fetched successfully for subject ${subjectId}`,
      data: papers,
    });
  } catch (error) {
    console.error('Get papers by subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.deletePreviousQuestionPaper = async (req, res) => {
  try {
    const { id } = req.params;

    const paper = await PreviousQuestionPaper.findById(id);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Previous question paper not found',
      });
    }

    if (paper.fileUrl) {
      const filePath = path.resolve(paper.fileUrl);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('File delete error:', err);
        }
      });
    }

    await PreviousQuestionPaper.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Previous question paper deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
