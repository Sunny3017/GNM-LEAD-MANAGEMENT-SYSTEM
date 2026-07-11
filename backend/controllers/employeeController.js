
const Employee = require('../models/Employee');
const Property = require('../models/Property');
const Lead = require('../models/Lead');

exports.createEmployee = async (req, res) => {
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
    
    const employee = await Employee.create(trimmedData);
    res.status(201).json({ success: true, employee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error('Error getting employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
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
    
    const employee = await Employee.findByIdAndUpdate(req.params.id, trimmedData, {
      new: true,
      runValidators: true
    });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.resetEmployeePassword = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    employee.password = req.body.password;
    await employee.save();
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEmployeePerformance = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const properties = await Property.find({ 'addedBy.employeeId': employeeId });
    const leads = await Lead.find({ assignedEmployee: employeeId });
    
    const performance = {
      propertiesAdded: properties.length,
      approvedProperties: properties.filter(p => p.approvalStatus === 'Approved').length,
      pendingProperties: properties.filter(p => p.approvalStatus === 'Pending Approval').length,
      totalLeads: leads.length,
      closedLeads: leads.filter(l => l.leadStatus === 'Closed').length
    };
    
    res.status(200).json({ success: true, performance });
  } catch (error) {
    console.error('Error getting employee performance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    console.log('Deleting employee with ID:', req.params.id);
    const employee = await Employee.findById(req.params.id);
    console.log('Found employee to delete:', employee);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Unassign all leads from this employee
    await Lead.updateMany(
      { assignedEmployee: req.params.id },
      { 
        $unset: { assignedEmployee: 1, assignedAt: 1, assignedBy: 1 } 
      }
    );
    
    // Optional: We can keep the addedBy on properties for history, 
    // but if we want, we can remove the employeeId while keeping the name
    await Property.updateMany(
      { 'addedBy.employeeId': req.params.id },
      { $unset: { 'addedBy.employeeId': 1 } }
    );
    
    await Employee.deleteOne({ _id: req.params.id });
    console.log('Employee deleted successfully!');
    
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
