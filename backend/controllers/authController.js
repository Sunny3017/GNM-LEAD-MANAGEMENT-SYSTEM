
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

exports.adminLogin = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    
    if ((!email && !mobile) || !password) {
      return res.status(400).json({ message: 'Please provide email/mobile and password' });
    }
    
    const query = {};
    if (email) query.email = email;
    if (mobile) query.mobile = mobile;
    
    const admin = await Admin.findOne(query).select('+password');
    
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    sendTokenResponse(admin, 'admin', 200, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.employeeLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;
    
    if (!mobileNumber || !password) {
      return res.status(400).json({ message: 'Please provide mobile number and password' });
    }
    
    const employee = await Employee.findOne({ mobileNumber }).select('+password');
    
    if (!employee || !(await employee.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (employee.status === 'Inactive') {
      return res.status(403).json({ message: 'Your account is inactive' });
    }
    
    sendTokenResponse(employee, 'employee', 200, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendTokenResponse = (user, role, statusCode, res) => {
  const token = user.getSignedJwtToken();
  
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name || user.fullName,
      role
    }
  });
};

exports.getMe = async (req, res) => {
  try {
    const userObj = req.user.toObject();
    const userData = {
      id: userObj._id,
      name: userObj.name || userObj.fullName,
      role: req.user.role
    };
    if (req.user.role === 'employee') {
      userData.fullName = userObj.fullName;
      userData.mobileNumber = userObj.mobileNumber;
      userData.status = userObj.status;
    }
    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
