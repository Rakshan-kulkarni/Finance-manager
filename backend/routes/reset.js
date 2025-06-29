const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
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

// DELETE /api/reset - deletes all data for the logged-in user only
router.delete('/', requireAuth, async (req, res) => {
  try {
    await Budget.deleteMany({ user: req.userId });
    await Transaction.deleteMany({ user: req.userId });
    await Reminder.deleteMany({ user: req.userId });
    res.json({ message: 'All user data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 