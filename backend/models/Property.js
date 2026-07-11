
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    enum: ['Flat', 'Villa', 'Plot', 'Shop', 'Office'],
    required: true
  },
  purpose: {
    type: String,
    enum: ['Sale', 'Rent'],
    required: true
  },
  suitableFor: {
    type: String,
    enum: ['Family', 'Bachelors', 'Both'],
    default: null
  },
  societyName: {
    type: String,
    required: true
  },
  configuration: {
    type: String,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Sold', 'Rented', 'On Hold'],
    default: 'Available'
  },
  propertyTitle: String,
  floorNumber: Number,
  totalFloors: Number,
  furnishingStatus: {
    type: String,
    enum: ['Raw', 'Semi Furnished', 'Fully Furnished'],
    default: null
  },
  facing: String,
  propertyAge: Number,
  amenities: [String],
  description: String,
  hasVideo: {
    type: Boolean,
    default: false
  },
  tower: String,
  unitNumber: String,
  ownerType: {
    type: String,
    enum: ['Owner', 'Broker'],
    default: 'Owner'
  },
  ownerName: String,
  ownerPhone: String,
  addedBy: {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'addedByModel'
    },
    employeeName: {
      type: String,
      required: true
    }
  },
  addedByModel: {
    type: String,
    enum: ['Admin', 'Employee'],
    default: 'Employee'
  },
  approvalStatus: {
    type: String,
    enum: ['Pending Approval', 'Approved', 'Rejected'],
    default: 'Pending Approval'
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  lastUpdatedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

PropertySchema.index({ societyName: 1, purpose: 1, configuration: 1, price: 1 });

module.exports = mongoose.model('Property', PropertySchema);
