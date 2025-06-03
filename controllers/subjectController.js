// controllers/subjectController.js

const Subject = require('../models/Subject');

// ✅ Create Subject
exports.createSubject = async (req, res) => {
  try {
    const { name, exam, instituteId } = req.body;

    if (!name || !exam || !instituteId) {
      return res.status(400).json({ error: 'Name, exam, and instituteId are required' });
    }

    const subject = new Subject({ name, exam, instituteId });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update Subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, exam, instituteId } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (exam) updatedFields.exam = exam;
    if (instituteId) updatedFields.instituteId = instituteId;

    const subject = await Subject.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Subject
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get All Subjects (optional exam filter)
exports.getAllSubjects = async (req, res) => {
  try {
    const { examId } = req.query;

    const filter = examId ? { exam: examId } : {};
    const subjects = await Subject.find(filter).populate('exam', 'name');

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id).populate('exam', 'name');

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get Subjects by Institute ID
exports.getSubjectsByInstituteId = async (req, res) => {
  try {
    const { instituteId } = req.params;

    const subjects = await Subject.find({ instituteId }).populate('exam', 'name');

    res.json(subjects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getSubjectsByExamId = async (req, res) => {
  try {
    const { examId } = req.params;

    const subjects = await Subject.find({ exam: examId });

    res.status(200).json({
      success: true,
      message: 'Subjects fetched by exam ID',
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
      error: error.message,
    });
  }
};