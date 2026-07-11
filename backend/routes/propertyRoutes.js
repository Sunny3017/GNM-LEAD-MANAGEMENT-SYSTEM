
const express = require('express');
const router = express.Router();
const { 
  createProperty, 
  getProperties, 
  getProperty, 
  updateProperty, 
  deleteProperty,
  approveProperty,
  getMyProperties,
  getUniqueSocieties
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .post(protect, authorize('admin', 'employee'), createProperty)
  .get(protect, authorize('admin', 'employee'), getProperties);

router.route('/my')
  .get(protect, authorize('employee'), getMyProperties);

router.route('/societies')
  .get(protect, authorize('admin', 'employee'), getUniqueSocieties);

router.route('/:id')
  .get(protect, authorize('admin', 'employee'), getProperty)
  .put(protect, authorize('admin', 'employee'), updateProperty)
  .delete(protect, authorize('admin'), deleteProperty);

router.route('/:id/approve')
  .put(protect, authorize('admin'), approveProperty);

module.exports = router;
