const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number },
  dueDate: { type: Date, required: true },
  isPaid: { type: Boolean, default: false },
  category: { type: String },
  recurrence: { type: String, default: 'none' },
  notes: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ReminderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('Reminder', ReminderSchema); 