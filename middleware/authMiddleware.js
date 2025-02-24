const jwt = require('jwt-simple');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    role: user.role
  };
  return jwt.encode(payload, SECRET_KEY);
};

// Middleware to verify token and authorize user role
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Token is required');
  }

  try {
    const decoded = jwt.decode(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Invalid Token');
  }
};

// Role-based access control middleware
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send('You do not have permission');
    }
    next();
  };
};

module.exports = { generateToken, verifyToken, checkRole };
