const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {protect} = require('../middleware/authMiddleware')

// GET User Route - Get user info using the token
router.get('/get', protect, async (req, res) => {

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});

module.exports = router;
