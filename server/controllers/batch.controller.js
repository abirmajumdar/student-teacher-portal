const cloudinary = require('cloudinary').v2;
const Batch = require('../models/batch.model.js');
const Teacher = require('../models/teacher.model.js');
const Course = require('../models/course.model.js');
const Pdf = require('../models/pdf.model.js')
const Quiz = require('../models/quiz.model');
const QuizResult = require('../models/quizresult.model.js');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const createBatch = async (req, res) => {
  try {
    const { title, description, email,password } = req.body;

    if (!title || !description || !email) {
      return res.status(401).json({ message: "Every field is required" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(403).json({ message: "No file uploaded" });
    }

    const { image } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFormats.includes(image.mimetype)) {
      return res.status(415).json({ message: "Invalid image format (only PNG and JPEG allowed)" });
    }

    const uploadResult = await cloudinary.uploader.upload(image.tempFilePath);

    const existingTeacher = await Teacher.findOne({ email });

    if (!existingTeacher) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    const batchData = {
      title,
      description,
      image: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url
      },
      createdBy: existingTeacher._id ,// store reference ID
      password:password
    };

    const newBatch = await Batch.create(batchData);

    res.status(201).json({ message: "Batch created successfully", batch: newBatch });
  } catch (error) {
    console.error("Batch creation error:", error);
    res.status(500).json({ message: "Server error while creating batch" });
  }
};



const getAllBatch = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('createdBy', 'name email') // Only populate selected fields from Teacher
      // .populate('Course', 'title description') // Adjust fields based on your Course model
      .sort({ createdAt: -1 }); // Optional: latest first

    res.status(200).json({
      success: true,
      message: 'Batches fetched successfully',
      data: batches,
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batches',
      error: error.message,
    });
  }
};


const getAllBatchesByTeacher = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Teacher email is required',
      });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Find batches created by the teacher
    const batches = await Batch.find({ createdBy: teacher._id })
     

    res.status(200).json({
      success: true,
      message: 'Batches fetched successfully',
      data: batches,
    });
  } catch (error) {
    console.error('Error fetching teacher batches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batches',
      error: error.message,
    });
  }
};

const addCourse = async (req, res) => {
  
  try {
    const { title, contentType, email } = req.body;
    const batchId = req.params.id
    const contentFile = req.files?.content;

    if (!title || !contentType || !contentFile || !batchId || !email) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const allowedContentTypes = ['video', 'text', 'pdf'];
    if (!allowedContentTypes.includes(contentType)) {
      return res.status(400).json({ message: 'Invalid content type. Must be "video", "text" or "pdf".' });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found.' });

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });

    // Set Cloudinary resource_type depending on contentType
    let resourceType = 'raw'; // default for pdf and text
    if (contentType === 'video') resourceType = 'video';

    const uploadResult = await cloudinary.uploader.upload(contentFile.tempFilePath, {
      resource_type: resourceType,
      folder: 'courses',
    });
    
    const newCourse = await Course.create({
      title,
      contentType,
      content: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
      batch: batch._id,
      createdBy: teacher._id,
    });

    batch.courses.push(newCourse._id);
    await batch.save();

    return res.status(201).json({
      message: 'Course added successfully.',
      course: newCourse,
    });
  } catch (error) {
    console.error('Error adding course:', error);
    return res.status(500).json({ message: 'Server error while adding course.' });
  }
};
// const path = require('path');

// const addCourse = async (req, res) => {
//   try {
//     const { title, contentType, email } = req.body;
//     const batchId = req.params.id;
//     const contentFile = req.files?.content;

//     if (!title || !contentType || !contentFile || !batchId || !email) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     const allowedContentTypes = ['video', 'text', 'pdf'];
//     if (!allowedContentTypes.includes(contentType)) {
//       return res.status(400).json({ message: 'Invalid content type. Must be "video", "text" or "pdf".' });
//     }

//     const batch = await Batch.findById(batchId);
//     if (!batch) return res.status(404).json({ message: 'Batch not found.' });

//     const teacher = await Teacher.findOne({ email });
//     if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });

//     // Set Cloudinary resource_type depending on contentType
//     let resourceType = 'raw'; // default for pdf and text
//     if (contentType === 'video') resourceType = 'video';

//     // Build a unique public_id with the file extension
//     const originalName = contentFile.name; // e.g., "document.pdf"
//     const fileExtension = path.extname(originalName); // ".pdf"
//     const fileNameWithoutExt = path.basename(originalName, fileExtension);
//     const uniqueSuffix = Date.now();
//     const finalPublicId = `courses/${fileNameWithoutExt}-${uniqueSuffix}${fileExtension}`;

//     const uploadResult = await cloudinary.uploader.upload(contentFile.tempFilePath, {
//       resource_type: resourceType,
//       public_id: finalPublicId, // Includes the correct extension
//     });

//     const newCourse = await Course.create({
//       title,
//       contentType,
//       content: {
//         public_id: uploadResult.public_id,
//         url: uploadResult.secure_url,
//       },
//       batch: batch._id,
//       createdBy: teacher._id,
//     });

//     batch.courses.push(newCourse._id);
//     await batch.save();

//     return res.status(201).json({
//       message: 'Course added successfully.',
//       course: newCourse,
//     });
//   } catch (error) {
//     console.error('Error adding course:', error);
//     return res.status(500).json({ message: 'Server error while adding course.' });
//   }
// };
const pdfUpload =  async(req, res) => {
  const { batchId } = req.params;
  const { title } = req.body;
  const pdf = req.file.path; 

  if (!pdf) {
    return res.status(400).json({ message: 'No PDF file uploaded.' });
  }

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    const newPdf = await Pdf.create({
      title,
      pdf,
      batch: batchId,
    });

    batch.pdfs.push(newPdf._id);
    await batch.save();

    console.log('PDF uploaded');
    return res.status(201).json({ message: 'PDF uploaded successfully.', pdf: newPdf });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error while uploading PDF.' });
  }
};


const getCoursesByBatch = async (req, res) => {
  const { batchId } = req.params;
  try {
    // Ensure batchId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ success: false, message: 'Invalid batch ID' });
    }

    const courses = await Course.find({ batch: new mongoose.Types.ObjectId(batchId) })
      .populate('createdBy', 'email')
      .populate('batch', 'title');

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching courses by batch:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const verifyPassword = async (req, res) => {
  const { batchId, password } = req.body; // ✅ Correct variable name

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    if (batch.password === password) {
      return res.status(200).json({ message: "Batch password verified" });
    } else {
      return res.status(402).json({ error: "Incorrect password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPdfByBatchId =async(req,res)=>{
  try {
    const batchId = req.params.id;

    const pdfs = await Pdf.find({ batch: batchId }).sort({ createdAt: -1 });

    res.status(200).json({ pdfs });
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ message: 'Server error fetching PDFs' });
  }
}

// controllers/quiz.controller.js


const uploadQuiz = async (req, res) => {
  const { batchId } = req.params;
  const { title, questions } = req.body; // questions should be an array of objects

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    const newQuiz = await Quiz.create({
      title,
      batch: batchId,
      questions, // assume validated on frontend
    });

    batch.quizzes.push(newQuiz._id);
    await batch.save();

    return res.status(201).json({ message: 'Quiz uploaded successfully.', quiz: newQuiz });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error uploading quiz.' });
  }
};

const viewQuizTeacher=async(req,res)=>{
  try {
    const { batchId } = req.params;
    const quizzes = await Quiz.find({ batch: batchId }).select('-__v').sort({ createdAt: -1 });
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quizzes', error: error.message });
  }
}


// Student submits answers for a quiz
const submitQuizAnswers = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    // return console.log(token)
    const cleanToken = token.trim().replace(/^"|"$/g, '');


    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    const studentId = decoded.id;

    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    let score = 0;
    const total = quiz.questions.length;

    for (const question of quiz.questions) {
      const studentAnswerObj = answers.find(a => a.questionId === question._id.toString());
      if (studentAnswerObj && studentAnswerObj.answer === question.correctAnswer) {
        score++;
      }
    }
    const existingResult = await QuizResult.findOne({ quiz: quizId, student: studentId });

if (existingResult) {
  throw new Error('You already attempted the quiz.');
}
    const newResult = await QuizResult.create({
      quiz: quizId,
      student: studentId,
      answers,
      score,
      total,
    });

    res.status(200).json({
      message: 'Quiz submitted successfully.',
      score,
      total,
      resultId: newResult._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting quiz answers.' });
  }
};
const getStudentQuizResults = async (req, res) => {
  try {
    const studentId = req.user._id; // authenticated user

    const results = await QuizResult.find({ student: studentId })
      .populate('quiz', 'title') // populate quiz title
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quiz results.' });
  }
};


module.exports = {createBatch,getAllBatch,getAllBatchesByTeacher,addCourse,getCoursesByBatch,verifyPassword,pdfUpload,getPdfByBatchId,uploadQuiz,viewQuizTeacher,submitQuizAnswers,getStudentQuizResults};
