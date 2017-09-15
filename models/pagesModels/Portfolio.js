
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({

}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
