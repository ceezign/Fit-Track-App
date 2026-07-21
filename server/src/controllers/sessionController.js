const Session = require('../models/Session');
const User = require('../models/User');

async function getSessions(req, res, next) {
  try {
    const sessions = await Session.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
}

async function createSession(req, res, next) {
  try {
    const { date, activity, duration, intensity, burned, sets, reps, weight, distance, notes } = req.body;

    if (!activity || !duration || burned === undefined || burned === null) {
      return res.status(400).json({ message: 'Activity, duration and calories burned are required' });
    }

    const session = await Session.create({
      userId: req.user._id,
      date: date || Date.now(),
      activity,
      duration,
      intensity,
      burned,
      sets,
      reps,
      weight,
      distance,
      notes,
    });

    // Keep lightweight user stats in sync
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalWorkouts: 1 } });

    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
}

async function updateSession(req, res, next) {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const fields = ['date', 'activity', 'duration', 'intensity', 'burned', 'sets', 'reps', 'weight', 'distance', 'notes'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) session[field] = req.body[field];
    });

    await session.save();
    res.json({ session });
  } catch (err) {
    next(err);
  }
}

async function deleteSession(req, res, next) {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalWorkouts: -1 } });
    res.json({ message: 'Session deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSessions, createSession, updateSession, deleteSession };
