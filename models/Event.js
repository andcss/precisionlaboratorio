
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  linkText: { type: String, default: 'Leia Mais' },
  url_image: { type: String, default: '' },
  startDate: { type: Date, default: Date.now() },
  endDate: { type: Date, default: Date.now() },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
