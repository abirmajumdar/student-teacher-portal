const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'text','pdf'], required: true },
  content: {
    public_id :{type:String,required:true},
    url : {type:String,required:true}
}, 
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // teacher
}, { timestamps: true });

const courseModel= mongoose.model('Course', courseSchema);
module.exports = courseModel

