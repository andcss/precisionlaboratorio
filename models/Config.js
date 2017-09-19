
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new mongoose.Schema({
  _roles: [{
    role: {type: Schema.Types.ObjectId, ref: 'Role' }
  }],
}, { timestamps: true, index: false });

const Config = mongoose.model('Config', configSchema);

module.exports = Config;
