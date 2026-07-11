
const express = require('express');
const router = express.Router();
const { 
  createEmployee, 
  getEmployees, 
  getEmployee, 
  updateEmployee, 
  resetEmployeePassword,
  getEmployeePerformance,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .post(protect, authorize('admin'), createEmployee)
  .get(protect, authorize('admin'), getEmployees);

router.route('/:id')
  .get(protect, authorize('admin'), getEmployee)
  .put(protect, authorize('admin'), updateEmployee)
  .delete(protect, authorize('admin'), deleteEmployee);

router.route('/:id/reset-password')
  .put(protect, authorize('admin'), resetEmployeePassword);

router.route('/:id/performance')
  .get(protect, authorize('admin'), getEmployeePerformance);

module.exports = router;
