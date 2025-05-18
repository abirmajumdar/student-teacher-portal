const express = require("express");
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose');
const router = require("./routers/otp.routes.js");
const cloudinary = require('cloudinary').v2
const fileUpload =require('express-fileupload') ;


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(cors())

dotenv.config()

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("server is running on " + PORT)
})


const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI).then(() => {
    console.log("database connected")
}).catch((e) => {
    console.log(e)
})

app.use('/otp', router)

app.use('/auth/teacher', require('./routers/teacherauth.route.js'))
app.use('/batch', require('./routers/batch.route.js'))

// Configuration
cloudinary.config({
    cloud_name: 'dfdazric5',
    api_key: '863459796595879',
    api_secret: 'fBGoG3DSTeMhmQI531lphOscEWI' // Click 'View API Keys' above to copy your API secret
});