const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Nayi fields OTP ke liye
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);