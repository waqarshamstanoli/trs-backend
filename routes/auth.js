const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../middleware/Validation');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
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
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  const secretKey = 'p9c025YrTAcDeKWX277O1ihxSYjOQfNS'; 
  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      res.json({ message: 'Login successful',token,  userId: user._id });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

 
  router.post('/register', async (req, res) => {
    const { email, password, c_password } = req.body;

    if (!email || !password || !c_password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== c_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const randomPassword = generateRandomPassword();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword 
        });

        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Account Registration - Password Included',
            text: `Welcome! Your account has been created successfully.\n\nYour temporary password is: ${randomPassword}\n\nPlease change your password after logging in.`
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'User registered successfully and email sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

  module.exports = router;