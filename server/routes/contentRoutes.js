const express = require("express");
const router = express.Router();
const Content = require("../models/Content");

router.post("/", async (req, res) => {
  const content = await Content.create(req.body);
  res.json(content);
});

router.get("/:topicId", async (req, res) => {
  const data = await Content.find({
    topicId: req.params.topicId
  });
  res.json(data);
});

module.exports = router;