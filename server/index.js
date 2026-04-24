require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini using the key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
You are an AI co-creator helping teachers in rural India build curriculum materials.
Your goal is to produce a real, usable output—a lesson plan, worksheet, or quiz—that reflects the teacher's unique style, their students' level, and their local context.

RULES:
- You must guide the user through an 11-question flow.
- Ask only 1 or 2 questions at a time. Natural conversation is key.
- Never show a long form or list all questions at once.
- After the teacher answers question 6, produce a brief first draft.
- Then, ask the remaining questions to refine it.

CRITICAL OUTPUT RULE:
When you have asked the necessary questions and are ready to generate the lesson plan, you MUST format your response exactly like this:

Here is the draft of your lesson plan!
[FINAL_DOCUMENT]
# Lesson Plan: [Title]
(Rest of the document in clean Markdown format)
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // Format the React history for Gemini
    const formattedHistory = history
      .slice(0, -1) 
      .map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    
    res.json({ reply: result.response.text() });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});