
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  name: String,
  seo: { Schema.Types.ObjectId, ref: 'SEO' },
}, { timestamps: true, strict: false }, );

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
