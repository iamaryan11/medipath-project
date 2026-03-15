const mongoose=require('mongoose')
const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, default: 'Private' }, 
  specialties: [{ type: String }],
  contactNumber: { type: String },
  emergency24x7: { type: Boolean, default: false },
  totalBeds: { type: Number },
  
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      required: true
    }
  },
  address: {
    street: { type: String, default: 'N/A' },
    city: { type: String, default: 'Chandigarh' },
    sector: { type: String, default: 'N/A' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);