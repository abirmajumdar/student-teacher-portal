const express = require('express')
const {createBatch,getAllBatch,getAllBatchesByTeacher,addCourse, getCoursesByBatch, verifyPassword, pdfUpload, getPdfByBatchId} = require('../controllers/batch.controller.js')
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

router.post('/add-course/:id',addCourse)
router.get('/get-courses-by-batchid/:batchId',getCoursesByBatch)
router.post('/verify-batch-password',verifyPassword)

router.post('/upload-pdf/:batchId', upload.single("pdf"), pdfUpload);

router.get('/get-pdfs-by-batchid/:id', getPdfByBatchId);

module.exports = router