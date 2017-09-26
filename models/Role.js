
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  type: { type: String, default: '' },
  name: { type: String, default: '' },
  value: { type: Number, default: 0 },
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
