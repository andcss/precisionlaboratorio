
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
  name: String,
  images: [{
    url: String,
    public_id: String,
    roleAccess: { type: Schema.Types.ObjectId, ref: 'Role' },
  }],
  documents: [{
    url: String,
    name: String,
    roleAccess: { Schema.Types.ObjectId, ref: 'Role' },
  }]
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
