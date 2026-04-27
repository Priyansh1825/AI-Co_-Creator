const Groq = require('groq-sdk');
const Curriculum = require('../models/Curriculum');
const Chat = require('../models/Chat');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getSystemInstruction = (libraryData) => `
You are an AI co-creator helping teachers in rural India build curriculum materials.

CRITICAL DIRECTIVES:
1. You MUST guide the user through the exact 11 questions listed below in order.
2. DO NOT ask ANY questions outside of this specific list.
3. Ask only 1 or 2 questions at a time.

=== YOUR KNOWLEDGE BASE ===
Here is the official library of verified teaching ideas pulled from our database:
${JSON.stringify(libraryData, null, 2)}

When generating the final lesson plan, you MUST prioritize using the "creative_hooks", "group_activities", and "local_connections" from this database if the user's topic matches.
===========================

THE STRICT 11-QUESTION LIST:
1. What subject and grade/age do you teach?
2. Which state/region are you in, and what is the medium of instruction?
3. What is your students' reading/writing level?
4. What specific topic or chapter are you planning to teach next?
5. What output do you want (lesson plan, worksheet, quiz)?
6. How long is the class period, and how many days to teach this topic?
7. What is your preferred teaching style (stories, diagrams, group work)?
8. Is there anything from your local area or culture to connect to this lesson?
9. Are there any topics, words, or formats to strictly avoid?
10. Do students have access to devices/projectors, or is this paper-only?
11. Do you have a printer, or should it fit on a single page for the blackboard?

CRITICAL OUTPUT RULE:
When you are ready to generate the final output, you MUST format your response exactly like this:

Here is the draft of your lesson plan! Let me know what to change.
[FINAL_DOCUMENT]
# Lesson Plan: [Title]
(Rest of the document in clean Markdown format)
`;

const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    // 1. Fetch knowledge base from MongoDB
    const allCurriculums = await Curriculum.find({}).lean();

    // 2. Format history for Groq (React 'ai' -> Groq 'assistant')
    const formattedHistory = history.slice(0, -1).map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content
    }));

    // 3. Assemble full message array
    const messages = [
      { role: "system", content: getSystemInstruction(allCurriculums) },
      ...formattedHistory,
      { role: "user", content: message }
    ];

    // 4. Call Groq Llama 3 API
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama3-70b-8192", 
      temperature: 0.1, 
    });

    const aiReply = chatCompletion.choices[0]?.message?.content || "Error: No response generated.";

    // 5. Save chat log to MongoDB
    await Chat.findOneAndUpdate(
      { sessionId: 'session_1' }, 
      { 
        $push: { 
          messages: { $each: [
            { role: 'user', content: message },
            { role: 'ai', content: aiReply }
          ]} 
        } 
      },
      { upsert: true, new: true } 
    );

    // 6. Send to Frontend
    res.json({ reply: aiReply });

  } catch (error) {
    console.error("Groq Controller Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};

module.exports = { handleChat };