
const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead 
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(protect, getNotifications)
  .put(protect, markAllAsRead);

router.route('/:id')
  .put(protect, markAsRead);

module.exports = router;
