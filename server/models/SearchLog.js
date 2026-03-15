const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
  userLocation: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  queryType: String,
  timestamp: { type: Date, default: Date.now },
  resultCount: Number,
  selectedHospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
});

module.exports = mongoose.model('SearchLog', searchLogSchema);