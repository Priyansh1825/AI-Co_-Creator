const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    index: true
  },

  title: String,
  body: String,

  ideaType: {
    type: String,
    enum: ["text", "story", "notes", "quiz"]
  },

  contentSource: {
    type: String,
    enum: ["AI", "Research", "Manual"]
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Content", contentSchema);