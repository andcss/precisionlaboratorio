
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  gallery: { Schema.Types.ObjectId, ref: 'Gallery' },
  seo: { Schema.Types.ObjectId, ref: 'SEO' },
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
