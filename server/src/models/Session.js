const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    activity: {
      type: String,
      required: [true, 'Activity type is required'],
      trim: true,
    },
    duration: {
      type: Number, // minutes
      required: [true, 'Duration is required'],
      min: 1,
    },
    intensity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    burned: {
      type: Number, // calories
      required: [true, 'Calories burned is required'],
      min: 0,
    },
    sets: { type: Number, min: 0 },
    reps: { type: Number, min: 0 },
    weight: { type: Number, min: 0 }, // kg
    distance: { type: Number, min: 0 }, // km
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

SessionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Session', SessionSchema);
