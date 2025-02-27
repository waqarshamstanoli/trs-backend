const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../middleware/Validation');
console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
          user: "4388cd3c1af573",
      pass: "783bf1a96f4b83"
    }
});
const secretKey = "p9c025YrTAcDeKWX277O1ihxSYjOQfNS"; // Store securely
const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

router.post('/login', async (req, res) => {
    console.log('Login route hit');
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Email not verified. Please verify your email to log in.' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const secretKey = 'p9c025YrTAcDeKWX277O1ihxSYjOQfNS';
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, user: user });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

 
  router.post("/register", async (req, res) => {
    const { email, password, c_password, userName } = req.body;
  
    if (!email || !password || !c_password || !userName) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    if (password !== c_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const role = email === 'waqar.shamstanoli@gmail.com' ? 'admin' : 'user';
      const newUser = new User({
        email,
        password: hashedPassword,
        role,
        userName,
        isVerified: false, 
      });
  
      await newUser.save();
  
      // Generate verification token
      const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: "1h" });
  
      // Verification link
      const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;
  
      // Send verification email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification - Confirm Your Account",
        html: `
          <h2>Welcome to Our Platform!</h2>
          <p>Click the link below to verify your email:</p>
          <a href="${verificationLink}" style="padding: 10px; background: #28a745; color: white; text-decoration: none;">Verify Email</a>
          <p>This link will expire in 1 hour.</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      res.status(201).json({ message: "User registered successfully. Please check your email for verification." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Verify Email Route
  router.get("/verify-email/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, secretKey);
  
      // Find user and update verification status
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      user.isVerified = true;
      await user.save();
  
      // Redirect to dashboard or login page
      res.redirect("http://localhost:4200/dashboard"); // Change this to your frontend dashboard route
    } catch (error) {
      console.error("Email verification failed:", error);
      res.status(400).json({ message: "Invalid or expired token" });
    }
  });

  module.exports = router;