
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  name: String,
  name: String,
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
