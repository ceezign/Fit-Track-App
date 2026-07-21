const Goal = require('../models/Goal');

async function getGoals(req, res, next) {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ deadline: 1 });
    res.json({ goals });
  } catch (err) {
    next(err);
  }
}

async function createGoal(req, res, next) {
  try {
    const { name, goal, current, metric, deadline } = req.body;

    if (!name || !goal || !metric || !deadline) {
      return res.status(400).json({ message: 'Name, target, metric and deadline are required' });
    }

    const created = await Goal.create({
      userId: req.user._id,
      name,
      goal,
      current: current || 0,
      metric,
      deadline,
    });

    res.status(201).json({ goal: created });
  } catch (err) {
    next(err);
  }
}

async function updateGoal(req, res, next) {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const fields = ['name', 'goal', 'current', 'metric', 'deadline'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) goal[field] = req.body[field];
    });

    await goal.save();
    res.json({ goal });
  } catch (err) {
    next(err);
  }
}

async function deleteGoal(req, res, next) {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
}

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
