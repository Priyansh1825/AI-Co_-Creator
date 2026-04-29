const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

router.post("/", async (req, res) => {
  const subject = await Subject.create(req.body);
  res.json(subject);
});

router.get("/:standardId", async (req, res) => {
  const data = await Subject.find({
    standardId: req.params.standardId
  });
  res.json(data);
});

module.exports = router;