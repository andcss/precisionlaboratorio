
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
  name: { type: String, default: ''},
  files: [{
    url: { type: String, default: ''},
    type: { type: String, default: ''},
    name: { type: String, default: ''},
    description: { type: String, default: ''},
    public_id: { type: String, default: ''},
    format: { type: String, default: ''}, 
    _role: { type: Schema.Types.ObjectId, ref: 'Role' },
  }]
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
