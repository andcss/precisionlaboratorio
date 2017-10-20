
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  name: String,
  customFields: Object,
  seo: {
    title: String,
    descripton: String,
    urlImage: String,
  },
}, { timestamps: true, strict: false } );

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
