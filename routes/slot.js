const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const { protect } = require('../middleware/authMiddleware');

// Create Slot Route
router.post('/create', protect, async (req, res) => {
  const { date, time, duration } = req.body;

  if (!date || !time || !duration) {
    return res.status(400).json({ message: 'Date, time, and duration are required' });
  }

  try {
    const slot = new Slot({
      creatorId: req.user.id, 
      date,
      time,
      duration,
    });

    await slot.save();

    res.status(201).json({
      message: 'Slot created successfully',
      slot: {
        date: slot.date,
        time: slot.time,
        duration: slot.duration,
        creatorId: slot.creatorId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating slot', error });
  }
});


// Book Slot Route (set isBooked to true)
router.put('/book/:id', protect, async (req, res) => {
  const slotId = req.params.id;

  try {
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'Slot is already booked' });
    }

    slot.isBooked = true;
    slot.studentId = req.user._id; 

    await slot.save();

    res.status(200).json({ message: 'Slot booked successfully', slot });
  } catch (error) {
    res.status(500).json({ message: 'Error booking slot', error });
  }
});

// Cancel Slot Booking (set isBooked to false)
router.put('/cancel/:id', protect, async (req, res) => {
  const slotId = req.params.id;

  try {
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (!slot.isBooked) {
      return res.status(400).json({ message: 'Slot is not booked' });
    }

    slot.isBooked = false;
    slot.studentId = null; 

    await slot.save();

    res.status(200).json({ message: 'Slot booking canceled', slot });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error });
  }
});

// Edit Slot Route
router.put('/edit/:id', protect, async (req, res) => {
  const { date, time, duration, studentId } = req.body;
  const slotId = req.params.id;

  try {
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this slot' });
    }

    slot.date = date || slot.date;
    slot.time = time || slot.time;
    slot.duration = duration || slot.duration;
    slot.studentId = studentId || slot.studentId;

    await slot.save();

    res.status(200).json({ message: 'Slot updated successfully', slot });
  } catch (error) {
    res.status(500).json({ message: 'Error updating slot', error });
  }
});

// Delete Slot Route
router.delete('/delete/:id', protect, async (req, res) => {
  const slotId = req.params.id;
  
  try {
    const slot = await Slot.findById(slotId);
    
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    
    if (slot.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this slot' });
    }
    
        const deleted = await Slot.findOneAndDelete({_id:slotId}); // Simplified deletion

    res.status(200).json({deleted, message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error); // Log error details for debugging
    res.status(500).json({ message: 'An error occurred while deleting the slot' });
  }
});


// Confirm Slot Route
router.put('/confirm/:id', protect, async (req, res) => {
  const slotId = req.params.id;

  try {
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.isConfirm) {
      return res.status(400).json({ message: 'Slot is already confirmed' });
    }

    slot.isConfirm = true;

    await slot.save();

    res.status(200).json({ message: 'Slot confirmed successfully', slot });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming slot', error });
  }
});


module.exports = router;
