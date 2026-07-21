const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Goal name is required'],
      trim: true,
    },
    goal: {
      type: Number, // target value
      required: [true, 'Target value is required'],
      min: 0,
    },
    current: {
      type: Number,
      default: 0,
      min: 0,
    },
    metric: {
      type: String, // e.g. "km", "kg", "sessions", "min"
      required: [true, 'Metric is required'],
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', GoalSchema);
