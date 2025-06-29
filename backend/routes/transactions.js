const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretkey'; // Should match the one in auth.js

// Middleware to check JWT and set req.userId
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

// Get all transactions for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new transaction for the logged-in user
router.post('/', requireAuth, async (req, res) => {
  const { description, amount, date, category, type } = req.body;
  const transaction = new Transaction({ description, amount, date, category, type, user: req.userId });
  try {
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a transaction (only if it belongs to the user)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a transaction (only if it belongs to the user)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updateFields = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateFields,
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 