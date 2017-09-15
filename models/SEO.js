
const mongoose = require('mongoose');

const SEOSchema = new mongoose.Schema({
  title: String,
  descripton: String,
  urlImage: String,
}, { timestamps: true });

const SEO = mongoose.model('SEO', SEOSchema);

module.exports = SEO;
