const express = require('express')
const {createBatch,getAllBatch,getAllBatchesByTeacher,addCourse, getCoursesByBatch, verifyPassword} = require('../controllers/batch.controller.js')

const router = express.Router()

router.post('/create-batch',createBatch)
router.get('/get-all-batches',getAllBatch)
router.post('/get-all-batches-by-teacher',getAllBatchesByTeacher)

router.post('/add-course/:id',addCourse)
router.get('/get-courses-by-batchid/:batchId',getCoursesByBatch)
router.post('/verify-batch-password',verifyPassword)

module.exports = router