const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: String,
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Topic", topicSchema);