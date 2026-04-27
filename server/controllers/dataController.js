const Curriculum = require('../models/Curriculum');

// Seed database with initial test data
const seedDatabase = async (req, res) => {
  try {
    await Curriculum.deleteMany({}); 
    await Curriculum.create({
      grade: "7th Grade",
      subject: "Science",
      topic: "Water Conservation and Rainwater Harvesting",
      creative_hooks: ["Start class with muddy water and ask how to clean it.", "Show a picture of a local Kalyani (stepwell)."],
      group_activities: ["DIY Filter: Build a water filter in a plastic bottle.", "Map the school roof to design a rain pipe system."],
      local_connections: ["Karnataka monsoon season.", "Discuss local drying lakes."]
    });
    res.json({ message: "Database seeded successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new curriculum entry from the React Admin Form
const addCurriculum = async (req, res) => {
  try {
    const { grade, subject, topic, creative_hooks, group_activities, local_connections } = req.body;
    
    const newEntry = await Curriculum.create({
      grade,
      subject,
      topic,
      creative_hooks: Array.isArray(creative_hooks) ? creative_hooks : [creative_hooks],
      group_activities: Array.isArray(group_activities) ? group_activities : [group_activities],
      local_connections: Array.isArray(local_connections) ? local_connections : [local_connections]
    });

    res.status(201).json({ message: "Data added successfully!", data: newEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { seedDatabase, addCurriculum };