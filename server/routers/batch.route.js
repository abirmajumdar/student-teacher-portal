const express = require('express')
const {createBatch,getAllBatch,getAllBatchesByTeacher,addCourse, getCoursesByBatch, verifyPassword, pdfUpload, getPdfByBatchId,uploadQuiz,viewQuizTeacher,submitQuizAnswers,getStudentQuizResults,createAssignment,submitAssignment,getAssignmentByBatchId, getAssignmentResult, getAllSubmissionsByAssignmentId,gradeAssignmentSubmission,getQuizResultsByID} = require('../controllers/batch.controller.js')
const multer  = require('multer')
const fileUpload = require('express-fileupload');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


const router = express.Router()

// router.post('/create-batch',createBatch)
router.post('/create-batch', fileUpload({ useTempFiles: true }), createBatch);
router.get('/get-all-batches',getAllBatch)
router.post('/get-all-batches-by-teacher',getAllBatchesByTeacher)

router.post('/add-course/:id',fileUpload({useTempFiles:true}),addCourse)
router.get('/get-courses-by-batchid/:batchId',getCoursesByBatch)
router.post('/verify-batch-password',verifyPassword)

router.post('/upload-pdf/:batchId', upload.single("pdf"), pdfUpload);

router.get('/get-pdfs-by-batchid/:id', getPdfByBatchId);


router.post('/upload-quiz/:batchId', uploadQuiz);
router.get('/view-quiz-teacher/:batchId',viewQuizTeacher)

router.post('/quiz/:quizId/submit', submitQuizAnswers);
router.get('/quiz/results', getStudentQuizResults);

router.post('/upload-assignment/:id',upload.single("pdf"),createAssignment)
router.get('/get-assignments-by-batchid/:id', getAssignmentByBatchId);
router.post('/submit-assignment/:id',upload.single("pdf"),submitAssignment)
router.post('/get-assignment-result/:id',getAssignmentResult)
router.get('/get-all-assignment-submission-by-id/:assignmentId',getAllSubmissionsByAssignmentId)
router.post('/submissions/:submissionId/grade',gradeAssignmentSubmission)
router.get('/get-quiz-result-by-id/:quizId',getQuizResultsByID)

module.exports = router