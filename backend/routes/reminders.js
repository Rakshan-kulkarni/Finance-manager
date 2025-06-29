const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretkey';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all reminders for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.userId });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new reminder for the logged-in user
router.post('/', requireAuth, async (req, res) => {
  const { title, amount, dueDate, isPaid, category, recurrence, notes } = req.body;
  const reminder = new Reminder({ title, amount, dueDate, isPaid, category, recurrence, notes, user: req.userId });
  try {
    const saved = await reminder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a reminder (only if it belongs to the user)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a reminder (only if it belongs to the user)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updateFields = req.body;
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateFields,
      { new: true }
    );
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 