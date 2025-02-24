const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { validateUser } = require('../middleware/Validation');
const bcrypt = require('bcrypt');
const userRoutes = require('./userRoutes');
const jwt = require('jsonwebtoken');
router.use('/api', userRoutes);



router.get('/', (req, res) => {
  if(process.env.MONGODB_URI){
    res.send('Hello, wonnmnmnmmrld!');
  }
  res.send('Hello, wonnmnmnmmrld!');
  console.error('Error during login:');
});




router.get('/about', (req, res) => {
    res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]);
});

module.exports = router;