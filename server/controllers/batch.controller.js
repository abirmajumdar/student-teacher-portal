const cloudinary = require('cloudinary').v2;
const Batch = require('../models/batch.model.js');
const Teacher = require('../models/teacher.model.js');
const Course = require('../models/course.model.js');
const mongoose = require('mongoose')

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

module.exports = {createBatch,getAllBatch,getAllBatchesByTeacher,addCourse,getCoursesByBatch,verifyPassword};
