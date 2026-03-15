const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedHospitals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }],
  defaultLocation: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);