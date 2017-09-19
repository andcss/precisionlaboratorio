
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  phone: String,
  whatsApp: String,
  email: String,
  seo: { Schema.Types.ObjectId, ref: 'SEO' },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
