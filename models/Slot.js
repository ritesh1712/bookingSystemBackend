const mongoose = require('mongoose');

const slotSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, 
      required: true,
    },
    duration: {
      type: Number, 
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false, 
    },
    isConfirm: { 
      type: Boolean, 
      default: false, 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Slot', slotSchema);
