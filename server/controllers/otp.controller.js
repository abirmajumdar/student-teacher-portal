const User = require('../models/user.model.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

// Email transporter setup (use environment variables in production)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use Mailtrap, SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();



const genarateToken=(id)=>{
  const token =jwt.sign({id},process.env.JWT_SECRET)
  return token
}
// Send 
// OTP to user's email
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = generateOTP();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Update or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    user.verificationCode = hashedOtp;
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification OTP',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email });
    if (!user || !user.verificationCode)
      return res.status(400).json({ message: 'User or OTP not found' });

    const hashedInput = crypto.createHash('sha256').update(otp).digest('hex');

    if (user.verificationCode !== hashedInput) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Optionally clear OTP after verification
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully', token:genarateToken(user._id) });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

module.exports = {sendOTP,verifyOTP}