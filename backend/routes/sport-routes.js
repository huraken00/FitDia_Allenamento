const express = require('express');
const router = express.Router();
const sportController = require('../controllers/sportController');

// Route to get all sports
router.get('/api/sport', sportController.getAllSports);

module.exports = router;
