const mongoose = require('mongoose')

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdf:{type:String ,required:true},
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // teacher
}, { timestamps: true });

const pdfModel= mongoose.model('Pdf', pdfSchema);
module.exports = pdfModel
