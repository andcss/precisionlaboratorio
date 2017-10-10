const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Pendente' },
  patient: {
    name: { type: String, default: '' },
    age: { type: Number, default: 0},
    gender: { type: String, default: '' },
  },
  domainColor: { type: String, default: '' },
  remainingColor: { type: String, default: '' },
  usedScale: { type: String, default: '' },
  orderInfos: {
    note: { type: String, default: '' },
    implat: { type: String, default: '' },
    model: { type: String, default: '' },
    diameter: { type: String, default: '' },
    previewDate: { type: Date, default: Date.now },
  },
  selectedTeeth: {
    t1: { type: Boolean, default: false },
    t2: { type: Boolean, default: false },
    t3: { type: Boolean, default: false },
    t4: { type: Boolean, default: false },
    t5: { type: Boolean, default: false },
    t6: { type: Boolean, default: false },
    t7: { type: Boolean, default: false },
    t8: { type: Boolean, default: false },
    t9: { type: Boolean, default: false },
    t10: { type: Boolean, default: false },
    t11: { type: Boolean, default: false },
    t12: { type: Boolean, default: false },
    t13: { type: Boolean, default: false },
    t14: { type: Boolean, default: false },
    t15: { type: Boolean, default: false },
    t16: { type: Boolean, default: false },
    t17: { type: Boolean, default: false },
    t18: { type: Boolean, default: false },
    t19: { type: Boolean, default: false },
    t20: { type: Boolean, default: false },
    t21: { type: Boolean, default: false },
    t22: { type: Boolean, default: false },
    t23: { type: Boolean, default: false },
    t24: { type: Boolean, default: false },
    t25: { type: Boolean, default: false },
    t26: { type: Boolean, default: false },
    t27: { type: Boolean, default: false },
    t28: { type: Boolean, default: false },
    t29: { type: Boolean, default: false },
    t30: { type: Boolean, default: false },
    t31: { type: Boolean, default: false },
    t32: { type: Boolean, default: false },
  },
  materials: [{ type: Schema.Types.ObjectId, ref: 'Material' }],
  options: {
    blade: { type: Boolean, default: false },
    qtdBlade: { type: Number, default: 0},
    crown: { type: Boolean, default: false },
    qtdCrown: { type: Number, default: 0},
    inlay: { type: Boolean, default: false },
    qtdInlay: { type: Number, default: 0},
  },

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
