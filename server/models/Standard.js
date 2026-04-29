const mongoose = require("mongoose");

const standardSchema = new mongoose.Schema({
  name: String,
  medium: {
    type: String,
    enum: ["English", "Kannada", "Hindi"]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Standard", standardSchema);