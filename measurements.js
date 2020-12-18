const mongoose = require('mongoose');

const MeasurementsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  data: [{ devid: {type: String, required: true},
           date: {type: String, default: "0000:00:00"},
           time: {type: String, default: "00:00:00"},
           co2value: {type: Number, required: true},
           noofpeopleinroom: {type: Number, default: 0},
           lon: {type: Number, default: 0},
           lat: {type: Number, default: 0}}]
});

const MeasurementsM = mongoose.model('MeasurementsM', MeasurementsSchema);

module.exports = { MeasurementsM };