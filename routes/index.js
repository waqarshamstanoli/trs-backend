const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

router.use('/auth', authRoutes);


router.get('/', (req, res) => {
  if(process.env.MONGODB_URI){
    res.send('Test');
  }
  res.send('Test');
  console.error('Error during login:');
});

module.exports = router;