
const Property = require('../models/Property');
const Notification = require('../models/Notification');

exports.createProperty = async (req, res) => {
  try {
    console.log('Creating property with data:', req.body);
    
    // Trim all string inputs and set empty strings to null for optional enum fields
    const trimmedData = {};
    for (const [key, value] of Object.entries(req.body)) {
      let processedValue = typeof value === 'string' ? value.trim() : value;
      // Set empty strings to null for fields that can be null/optional
      if (processedValue === '') {
        processedValue = null;
      }
      trimmedData[key] = processedValue;
    }
    
    const propertyData = {
      ...trimmedData,
      addedBy: {
        employeeId: req.user._id,
        employeeName: req.user.role === 'admin' ? req.user.name : req.user.fullName
      },
      addedByModel: req.user.role === 'admin' ? 'Admin' : 'Employee',
      approvalStatus: req.user.role === 'admin' ? 'Approved' : 'Pending Approval'
    };
    
    const property = await Property.create(propertyData);
    console.log('Property created successfully:', property);
    res.status(201).json({ success: true, property });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProperties = async (req, res) => {
  try {
    console.log('getProperties called with query:', req.query);
    const query = {};
    
    if (req.user.role === 'employee') {
      query.approvalStatus = 'Approved';
    } else if (req.query.approvalStatus) {
      // Admin can filter by approval status
      query.approvalStatus = req.query.approvalStatus;
    }
    
    if (req.query.societyName) {
      query.societyName = { $regex: req.query.societyName, $options: 'i' };
    }
    if (req.query.purpose) {
      query.purpose = req.query.purpose;
    }
    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType;
    }
    if (req.query.configuration) {
      query.configuration = req.query.configuration;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice && req.query.minPrice !== '') query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice && req.query.maxPrice !== '') query.price.$lte = Number(req.query.maxPrice);
      // If both are empty, delete the price key to avoid empty object
      if (Object.keys(query.price).length === 0) delete query.price;
    }
    if (req.query.minArea || req.query.maxArea) {
      query.area = {};
      if (req.query.minArea && req.query.minArea !== '') query.area.$gte = Number(req.query.minArea);
      if (req.query.maxArea && req.query.maxArea !== '') query.area.$lte = Number(req.query.maxArea);
      // If both are empty, delete the area key to avoid empty object
      if (Object.keys(query.area).length === 0) delete query.area;
    }
    if (req.query.floorNumber && req.query.floorNumber !== '') {
      query.floorNumber = Number(req.query.floorNumber);
    }
    if (req.query.furnishingStatus) {
      query.furnishingStatus = req.query.furnishingStatus;
    }
    if (req.query.suitableFor) {
      query.suitableFor = req.query.suitableFor;
    }
    if (req.query.facing) {
      query.facing = req.query.facing;
    }
    if (req.query.propertyAge && req.query.propertyAge !== '') {
      query.propertyAge = { $lte: Number(req.query.propertyAge) };
    }
    if (req.query.availabilityStatus) {
      query.availabilityStatus = req.query.availabilityStatus;
    }
    if (req.query.addedByEmployee) {
      query['addedBy.employeeId'] = req.query.addedByEmployee;
    }
    
    console.log('Final query:', query);
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || (req.user.role === 'admin' ? 0 : 10); // Admin gets all by default
    const skip = limit > 0 ? (page - 1) * limit : 0;
    
    let sort = { addedDate: -1 };
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    
    let queryBuilder = Property.find(query).sort(sort);
    
    if (limit > 0) {
      queryBuilder = queryBuilder.skip(skip).limit(limit);
    }
    
    const properties = await queryBuilder;
    const total = await Property.countDocuments(query);
    
    res.status(200).json({ 
      success: true, 
      count: properties.length, 
      total, 
      pages: limit > 0 ? Math.ceil(total / limit) : 1, 
      properties 
    });
  } catch (error) {
    console.error('Error in getProperties:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (req.user.role === 'employee' && property.addedBy.employeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    
    // Trim all string inputs and set empty strings to null for optional enum fields
    const trimmedData = {};
    for (const [key, value] of Object.entries(req.body)) {
      let processedValue = typeof value === 'string' ? value.trim() : value;
      // Set empty strings to null for fields that can be null/optional
      if (processedValue === '') {
        processedValue = null;
      }
      trimmedData[key] = processedValue;
    }
    
    trimmedData.lastUpdatedDate = Date.now();
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, trimmedData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({ success: true, property: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const { approvalStatus } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { approvalStatus, lastUpdatedDate: Date.now() },
      { new: true }
    );
    
    const notification = await Notification.create({
      recipient: property.addedBy.employeeId,
      recipientModel: 'Employee',
      message: `Your property has been ${approvalStatus.toLowerCase()}`,
      type: approvalStatus === 'Approved' ? 'Property Approved' : 'Property Rejected'
    });
    
    res.status(200).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ 'addedBy.employeeId': req.user._id });
    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUniqueSocieties = async (req, res) => {
  try {
    console.log('Fetching unique societies...');
    const societies = await Property.distinct('societyName');
    console.log('Found societies:', societies);
    res.status(200).json({ success: true, societies });
  } catch (error) {
    console.error('Error fetching societies:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
