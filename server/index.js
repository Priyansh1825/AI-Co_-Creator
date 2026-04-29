require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Mount Routes
app.use('/api', apiRoutes);
app.use("/api/standard", require("./routes/standardRoutes"));
app.use("/api/subject", require("./routes/subjectRoutes"));
app.use("/api/topic", require("./routes/topicRoutes"));
app.use("/api/content", require("./routes/contentRoutes"));

// 4. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});