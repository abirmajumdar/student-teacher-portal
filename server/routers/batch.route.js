const express = require('express')
const {createBatch,getAllBatch,getAllBatchesByTeacher,addCourse, getCoursesByBatch} = require('../controllers/batch.controller.js')

const router = express.Router()

router.post('/create-batch',createBatch)
router.get('/get-all-batches',getAllBatch)
router.get('/get-all-batches-by-teacher',getAllBatchesByTeacher)

router.post('/add-course/:id',addCourse)
router.get('/get-courses-by-batchid/:batchId',getCoursesByBatch)

module.exports = router