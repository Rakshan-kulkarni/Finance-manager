const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

TransactionSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('Transaction', TransactionSchema); 