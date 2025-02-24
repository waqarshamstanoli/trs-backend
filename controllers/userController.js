const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../config/auth');

// User registration
const register = async (req, res) => {
  consoe.log(req,'resuqest')
  try {
    const { email, password, role } = req.body;
    const user = new User({ email, password, role });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
      return res.status(400).send('Invalid credentials');
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
};

module.exports = { register, login };
