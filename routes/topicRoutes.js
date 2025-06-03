const express = require('express');
const router = express.Router();
const {
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicById,
  getAllTopics,
  getTopicsByInstituteId,
  getTopicsBySubjectId
} = require('../controllers/topicController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// REST routes for Topic
router.post('/create-topic', authenticateUser, authorizeRoles('super-admin','admin', 'teacher'), createTopic);         // Create topic

router.put('/update/topic/:id', authenticateUser, authorizeRoles('super-admin', 'admin', "teacher"), updateTopic);       // Update topic


router.get('/single-topic/:id', getTopicById);      // Get single topic

router.get('/topics', getAllTopics);         // Get all topics

router.delete('/delete/topic/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), deleteTopic);    // Delete topic


router.get('/topics/institute/:instituteId', getTopicsByInstituteId);


router.get('/topics/by-subject/:subjectId', getTopicsBySubjectId);


module.exports = router;
