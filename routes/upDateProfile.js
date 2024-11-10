const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { protect } = require('../middleware/authMiddleware'); 

// Update User Route
router.put('/updateProfile', protect, async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Name, email, and role are required' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists.id !== user.id) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

module.exports = router;
