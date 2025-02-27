const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  c_password: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['admin', 'user'], // Only allows 'admin' or 'user'
    default: 'user' // Default role is 'user'
},
});

const User = mongoose.model('User', userSchema);
module.exports = User;
