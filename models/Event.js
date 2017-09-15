
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  descripton: String,
  date: Date,
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
