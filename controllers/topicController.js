const Topic = require('../models/Topic');

// 🔹 Create Topic
exports.createTopic = async (req, res) => {
  try {
    const { subject, name, instituteId, topicDetail } = req.body;

    const topic = await Topic.create({ subject, name, instituteId, topicDetail });

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create topic',
      data: null,
    });
  }
};

// 🔹 Update Topic
exports.updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, name, instituteId } = req.body;

    const topic = await Topic.findByIdAndUpdate(
      id,
      { subject, name, instituteId },
      { new: true }
    );

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Topic updated successfully',
      data: topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update topic',
      data: null,
    });
  }
};

// 🔹 Delete Topic
exports.deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findByIdAndDelete(id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Topic deleted successfully',
      data: topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete topic',
      data: null,
    });
  }
};

// 🔹 Get Single Topic
exports.getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findById(id).populate('subject');

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Topic fetched successfully',
      data: topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topic',
      data: null,
    });
  }
};

// 🔹 Get All Topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate('subject');

    res.json({
      success: true,
      message: 'All topics fetched successfully',
      data: topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics',
      data: null,
    });
  }
};

// 🔹 Get Topics by Institute ID
exports.getTopicsByInstituteId = async (req, res) => {
  try {
    const { instituteId } = req.params;

    const topics = await Topic.find({ instituteId }).populate('subject');

    res.json({
      success: true,
      message: 'Topics fetched successfully by institute',
      data: topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics by institute',
      data: null,
    });
  }
};


exports.getTopicsBySubjectId = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const topics = await Topic.find({ subject: subjectId });

    res.status(200).json({
      success: true,
      message: 'Topics fetched by subject ID',
      data: topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics',
      error: error.message,
    });
  }
};