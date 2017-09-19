
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homeSchema = new Schema({
  slides: [{
    videoUrl: String,
    imageUrl: String,
  }],
  title: String,
  text: String,
  seo: { Schema.Types.ObjectId, ref: 'SEO' },
}, { timestamps: true });

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
