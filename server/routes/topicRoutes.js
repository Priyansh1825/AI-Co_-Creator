const express = require("express");
const router = express.Router();
const Topic = require("../models/Topic");

router.post("/", async (req, res) => {
  const topic = await Topic.create(req.body);
  res.json(topic);
});

router.get("/:subjectId", async (req, res) => {
  const data = await Topic.find({
    subjectId: req.params.subjectId
  });
  res.json(data);
});

module.exports = router;