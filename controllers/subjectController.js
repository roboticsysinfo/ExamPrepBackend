const Subject = require('../models/Subject');


// ✅ Create Subject
exports.createSubject = async (req, res) => {
  try {
    const { name, exam } = req.body;

    if (!name || !exam) {
      return res.status(400).json({ error: 'Name and exam are required' });
    }

    const subject = new Subject({ name, exam });
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
    const { name, exam } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (exam) updatedFields.exam = exam;

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

// ✅ Get All Subjects (with optional exam filter and population)
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

// ✅ Get Subject by ID (with exam data)
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

