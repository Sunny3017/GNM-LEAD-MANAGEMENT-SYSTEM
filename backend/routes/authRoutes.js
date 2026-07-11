
const express = require('express');
const router = express.Router();
const { adminLogin, employeeLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/admin/login', adminLogin);
router.post('/employee/login', employeeLogin);
router.get('/me', protect, getMe);

module.exports = router;
