const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
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

// Get all budgets for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new budget for the logged-in user
router.post('/', requireAuth, async (req, res) => {
  const { category, amount, period } = req.body;
  const budget = new Budget({ category, amount, period, user: req.userId });
  try {
    const saved = await budget.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a budget (only if it belongs to the user)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a budget (only if it belongs to the user)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updateFields = req.body;
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateFields,
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 