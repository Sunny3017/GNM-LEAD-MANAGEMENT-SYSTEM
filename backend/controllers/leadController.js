
const Lead = require('../models/Lead');
const Note = require('../models/Note');
const Notification = require('../models/Notification');

exports.createLead = async (req, res) => {
  try {
    // Trim all string inputs and set empty strings to null
    const trimmedData = {};
    for (const [key, value] of Object.entries(req.body)) {
      let processedValue = typeof value === 'string' ? value.trim() : value;
      if (processedValue === '') {
        processedValue = null;
      }
      trimmedData[key] = processedValue;
    }
    
    // If assigning employee, set assignment details
    if (trimmedData.assignedEmployee && req.user.role === 'admin') {
      trimmedData.assignedBy = req.user._id;
      trimmedData.assignedAt = new Date();
    }
    
    const lead = await Lead.create(trimmedData);
    
    if (trimmedData.assignedEmployee) {
      const notification = await Notification.create({
        recipient: trimmedData.assignedEmployee,
        recipientModel: 'Employee',
        message: 'New lead assigned to you',
        type: 'New Lead'
      });
    }
    
    // Populate the response
    const populatedLead = await Lead.findById(lead._id)
      .populate('assignedEmployee', 'fullName')
      .populate('assignedBy', 'fullName');
    
    res.status(201).json({ success: true, lead: populatedLead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'employee') {
      query.assignedEmployee = req.user._id;
    }
    
    const leads = await Lead.find(query)
      .populate('assignedEmployee', 'fullName')
      .populate('assignedBy', 'fullName');
    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedEmployee', 'fullName')
      .populate('assignedBy', 'fullName');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    // Trim all string inputs and set empty strings to null
    const trimmedData = {};
    for (const [key, value] of Object.entries(req.body)) {
      let processedValue = typeof value === 'string' ? value.trim() : value;
      if (processedValue === '') {
        processedValue = null;
      }
      trimmedData[key] = processedValue;
    }
    
    // If changing assigned employee, update assignment details
    if (trimmedData.assignedEmployee && req.user.role === 'admin') {
      trimmedData.assignedBy = req.user._id;
      trimmedData.assignedAt = new Date();
    }
    
    const lead = await Lead.findByIdAndUpdate(req.params.id, trimmedData, {
      new: true,
      runValidators: true
    });
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Populate the response
    const populatedLead = await Lead.findById(lead._id)
      .populate('assignedEmployee', 'fullName')
      .populate('assignedBy', 'fullName');
    
    res.status(200).json({ success: true, lead: populatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const note = await Note.create({
      leadId: req.params.id,
      note: req.body.note,
      addedBy: {
        employeeId: req.user._id,
        employeeName: req.user.fullName
      }
    });
    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ leadId: req.params.id });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
