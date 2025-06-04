const express = require('express');
const router = express.Router();

const upload = require('../middlewares/uploads'); // multer middleware
const minFileSize = require('../middlewares/minFileSize');
const {
  uploadPreviousQuestionPaper,
  getPreviousQuestionPapers,
  getPreviousQuestionPapersBySubject,
  deletePreviousQuestionPaper,
  getPreviousQuestionPapersByInstitute,
} = require('../controllers/previousQuestionPaperController');


router.post(
  '/upload/previous-question-paper',
  upload.single('file'),
  uploadPreviousQuestionPaper
);


router.get('/get/previouseQuestionPapers', getPreviousQuestionPapers);


router.get('/subject/previousQuestionPaper/:subjectId', getPreviousQuestionPapersBySubject);


router.delete('/delete/previousQuestionPaper/:id', deletePreviousQuestionPaper);


router.get('/previous-question-paper/by-institute/:instituteId', getPreviousQuestionPapersByInstitute);

module.exports = router;
