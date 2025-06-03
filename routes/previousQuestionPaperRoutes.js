const express = require('express');
const router = express.Router();

const upload = require('../middlewares/uploads'); // multer middleware
const minFileSize = require('../middlewares/minFileSize');
const {
  uploadPreviousQuestionPaper,
  getPreviousQuestionPapers,
  getPreviousQuestionPapersBySubject,
  deletePreviousQuestionPaper,
} = require('../controllers/previousQuestionPaperController');

const ONE_MB = 1 * 1024 * 1024;

router.post(
  '/upload/previous-question-paper',
  upload.single('file'),
  minFileSize(ONE_MB),
  uploadPreviousQuestionPaper
);

router.get('/get/previouseQuestionPapers', getPreviousQuestionPapers);

router.get('/subject/previousQuestionPaper/:subjectId', getPreviousQuestionPapersBySubject);

router.delete('/delete/previousQuestionPaper/:id', deletePreviousQuestionPaper);

module.exports = router;
