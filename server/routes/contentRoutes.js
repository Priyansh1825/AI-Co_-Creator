const express = require("express");
const router = express.Router();
const Content = require("../models/Content");

// POST
router.post("/", async (req, res) => {
  const content = await Content.create(req.body);
  res.json(content);
});

// ✅ PUT THIS FIRST
router.get("/full-tree", async (req, res) => {
  try {
    const data = await Content.find().populate({
      path: "topicId",
      populate: {
        path: "subjectId",
        populate: {
          path: "standardId"
        }
      }
    });

    const result = {};

    data.forEach(item => {
      const standard = item.topicId.subjectId.standardId;
      const subject = item.topicId.subjectId;
      const topic = item.topicId;

      // Standard level
      if (!result[standard._id]) {
        result[standard._id] = {
          standardId: standard._id,
          standardName: standard.name,
          medium: standard.medium,
          subjects: {}
        };
      }

      // Subject level
      if (!result[standard._id].subjects[subject._id]) {
        result[standard._id].subjects[subject._id] = {
          subjectId: subject._id,
          subjectName: subject.name,
          topics: {}
        };
      }

      // Topic level
      if (!result[standard._id].subjects[subject._id].topics[topic._id]) {
        result[standard._id].subjects[subject._id].topics[topic._id] = {
          topicId: topic._id,
          topicName: topic.name,
          contents: []
        };
      }

      // Content level
      result[standard._id]
        .subjects[subject._id]
        .topics[topic._id]
        .contents.push({
          contentId: item._id,
          title: item.title,
          ideaType: item.ideaType,
          contentSource: item.contentSource
        });
    });

    // Convert object → array
    const finalResult = Object.values(result).map(std => ({
      ...std,
      subjects: Object.values(std.subjects).map(sub => ({
        ...sub,
        topics: Object.values(sub.topics)
      }))
    }));

    res.json(finalResult);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❗ ALWAYS LAST (dynamic route)
router.get("/:topicId", async (req, res) => {
  const data = await Content.find({
    topicId: req.params.topicId
  });
  res.json(data);
});

module.exports = router;