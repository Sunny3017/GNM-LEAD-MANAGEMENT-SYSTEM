
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { email: process.env.ADMIN_EMAIL || 'admin@gnm.com' },
        { mobile: process.env.ADMIN_MOBILE || '9876543210' }
      ]
    });
    
    if (existingAdmin) {
      console.log('Admin already exists! No need to create a new one.');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    const admin = await Admin.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@gnm.com',
      mobile: process.env.ADMIN_MOBILE || '9876543210',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    });
    console.log('Admin created successfully!');
    console.log('Name:', process.env.ADMIN_NAME || 'Admin');
    console.log('Email:', process.env.ADMIN_EMAIL || 'admin@gnm.com');
    console.log('Mobile:', process.env.ADMIN_MOBILE || '9876543210');
    console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();
