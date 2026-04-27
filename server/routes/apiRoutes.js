const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const { seedDatabase, addCurriculum } = require('../controllers/dataController');

// Chat Route
router.post('/chat', handleChat);

// Database Management Routes
router.post('/seed-database', seedDatabase);
router.post('/curriculum', addCurriculum);

module.exports = router;