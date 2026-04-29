const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  standardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Standard",
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);