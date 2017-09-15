
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({

}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
