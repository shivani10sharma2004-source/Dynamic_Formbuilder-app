const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');

// Email bhejne ka setup (Updated for Gmail SMTP)
// Email bhejne ka setup (Explicit Gmail Settings for Render)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465 port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 1. REGISTER & SEND OTP ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // 6 digit ka random OTP banayein
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP 10 minute tak valid rahega

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser && !existingUser.isVerified) {
      // Agar user pehle ban gaya tha par verify nahi hua, toh OTP update karein
      existingUser.password = hashedPassword;
      existingUser.name = name;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      // Naya unverified user banayein
      const newUser = new User({ name, email, password: hashedPassword, otp, otpExpires });
      await newUser.save();
    }

    // Email send karein
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'FormFlow - Verify your Email',
      html: `<h2>Welcome to FormFlow!</h2><p>Your OTP for registration is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'OTP sent successfully!' });

  } catch (error) {
    console.log("SERVER MEIN YEH ERROR AAYA HAI:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. VERIFY OTP ROUTE
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // OTP sahi hai toh user ko verified mark karein aur OTP hata dein
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 3. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'Invalid email or email not verified.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful!', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;