const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const { protect } = require('../middleware/authMiddleware');

// Get Slots by studentId and creatorId
router.get('/getSlots', protect, async (req, res) => {
  const { studentId, creatorId } = req.query;

  if (!studentId || !creatorId) {
    return res.status(400).json({ message: 'studentId and creatorId are required' });
  }

  try {
    const slots = await Slot.find({ studentId, creatorId });

    if (slots.length === 0) {
      return res.status(404).json({ message: 'No slots found for the given studentId and creatorId' });
    }

    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving slots', error });
  }
});

// Get all Slots
router.get('/getAllSlots', protect, async (req, res) => {
  try {
    const slots = await Slot.find().populate('creatorId', 'name').populate('studentId', 'name');

    if (slots.length === 0) {
      return res.status(404).json({ message: 'No slots found' });
    }

       res.status(200).json(slots);
  } catch (error) {
    console.error('Error retrieving slots:', error);
    res.status(500).json({ message: 'Error retrieving slots', error });
  }
});


module.exports = router;
