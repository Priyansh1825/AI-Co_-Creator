const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  sessionId: { type: String, default: 'session_1' }, 
  messages: [{
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Chat', ChatSchema);