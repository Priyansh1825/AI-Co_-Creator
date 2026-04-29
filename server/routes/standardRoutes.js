const express = require("express");
const router = express.Router();
const Standard = require("../models/Standard");

// Create Standard
router.post("/", async (req, res) => {
  const standard = await Standard.create(req.body);
  res.json(standard);
});

// Get all
router.get("/", async (req, res) => {
  const data = await Standard.find();
  res.json(data);
});

module.exports = router;