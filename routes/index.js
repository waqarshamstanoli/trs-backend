const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const eventRoutes = require("./eventRoutes");
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);

router.get('/', (req, res) => {
  if(process.env.MONGODB_URI){
    res.send('Test');
  }
  res.send('Test');
  console.error('Error during login:');
});

module.exports = router;