import axios from "axios";
import Message from "../models/messageModel.js";

const GROQ_API_KEY = "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"; // put your Groq key here
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const sendAIMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { content } = req.body;

    if (!content) return res.status(400).json({ msg: "Content is required" });

    // 1. Save user message
    const userMsg = await Message.create({
      sender: userId,
      chatType: "AI",
      messageType: "text",
      content,
    });

    // 2. Send message to Groq API
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-70b-8192", // Groq's free model
        messages: [
          { role: "system", content: "You are syncronus AI" },
          { role: "user", content },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // 3. Save AI response
    const aiMsg = await Message.create({
      recipient: userId,
      chatType: "AI",
      messageType: "text",
      content: aiReply,
    });

    return res.status(200).json({ aiMessage: aiMsg });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

export const getAIMessages = async (req, res) => {
  try {
    const userId = req.userId;

    const messages = await Message.find({
      chatType: "AI",
      $or: [{ sender: userId }, { recipient: userId }],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error fetching AI messages" });
  }
};
