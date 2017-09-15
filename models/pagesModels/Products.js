
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({

}, { timestamps: true });

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
