
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  budget: Number,
  preferredSociety: String,
  preferredConfiguration: String,
  purchaseType: {
    type: String,
    enum: ['Sale', 'Rent'],
    required: true
  },
  leadStatus: {
    type: String,
    enum: ['New Lead', 'Contacted', 'Follow-Up', 'Site Visit Scheduled', 'Negotiation', 'Closed', 'Lost'],
    default: 'New Lead'
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  assignedAt: Date,
  followUpDate: Date,
  notes: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', LeadSchema);
