const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

const Standard = require("./models/Standard");
const Subject = require("./models/Subject");
const Topic = require("./models/Topic");
const Content = require("./models/Content");

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing old data...");
    await Standard.deleteMany();
    await Subject.deleteMany();
    await Topic.deleteMany();
    await Content.deleteMany();

    console.log("Seeding new data...");

    // 1. Create Standard
    const standard = await Standard.create({
      name: "10th Grade",
      medium: "English"
    });

    // 2. Create Subjects
    const math = await Subject.create({
      name: "Mathematics",
      standardId: standard._id
    });

    const science = await Subject.create({
      name: "Science",
      standardId: standard._id
    });

    // 3. Create Topics
    const algebra = await Topic.create({
      name: "Algebra",
      subjectId: math._id
    });

    const trigonometry = await Topic.create({
      name: "Trigonometry",
      subjectId: math._id
    });

    const physics = await Topic.create({
      name: "Motion",
      subjectId: science._id
    });

    // 4. Create Content
    await Content.create([
      {
        title: "Intro to Algebra",
        body: "Algebra basics explained...",
        ideaType: "text",
        contentSource: "Research",
        topicId: algebra._id
      },
      {
        title: "Algebra Story",
        body: "A story to explain algebra...",
        ideaType: "story",
        contentSource: "AI",
        topicId: algebra._id
      },
      {
        title: "Trigonometry Basics",
        body: "Angles and triangles...",
        ideaType: "notes",
        contentSource: "Manual",
        topicId: trigonometry._id
      },
      {
        title: "Motion Concept",
        body: "Physics motion explained...",
        ideaType: "text",
        contentSource: "Research",
        topicId: physics._id
      }
    ]);

    console.log("✅ Seed data inserted successfully!");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();