const mongoose = require('mongoose');

const CurriculumSchema = new mongoose.Schema({
  grade: String,
  subject: String,
  topic: String,
  creative_hooks: [String],
  group_activities: [String],
  local_connections: [String]
});

module.exports = mongoose.model('Curriculum', CurriculumSchema);