const mongoose = require('mongoose');

const amaSchema = new mongoose.Schema({
  expert: { type: String, required: true },
  topic: { type: String, required: true },
  date: { type: Date, required: true },
  questions: [{ type: String }],
});

module.exports = mongoose.model('AMA', amaSchema);