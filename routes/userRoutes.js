const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/', async (req, res) => {
    try {
      const users = await User.find(); 
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  });

 
router.post('/', async (req, res) => {
    try {
      const newUser = new User(req.body); 
      await newUser.save(); 
      res.status(201);
    } catch (error) {
      res.status(400).json({ error: 'Error creating user' });
    }
  });

  module.exports = router;