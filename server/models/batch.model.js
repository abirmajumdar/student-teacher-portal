const mongoose = require('mongoose')

const batchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    public_id :{type:String,required:true},
    url : {type:String,required:true}
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  password:{
    type:String
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  pdfs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pdf' }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }]
}, { timestamps: true });

const batchModel= mongoose.model('Batch', batchSchema);

module.exports = batchModel
