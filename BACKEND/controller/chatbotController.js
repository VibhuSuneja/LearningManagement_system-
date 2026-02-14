import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const chatbotResponse = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages history is required" });
    }

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    // We pass the messages history directly. 
    // The role in your frontend is 'user' or 'model'.
    // The new SDK usually expects 'user' and 'assistant' or 'model'.
    // Since searchController.js works with gemini-2.5-flash, let's use that.
    
    // We'll prepend the system instructions to the conversation.
    const systemInstruction = {
        role: "user",
        parts: [{ text: "System Instructions: You are 'Virtual Assistant', a friendly AI guide for the 'Virtual Courses' LMS platform. Guide students and educators professionally. Always maintain a helpful tone." }]
    };
    
    const ack = {
        role: "model",
        parts: [{ text: "Understood. I am ready to assist as the Virtual Assistant." }]
    };

    const contents = [systemInstruction, ack, ...messages];


    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    // In this SDK, property 'text' contains the response string
    if (response && response.text) {
        res.status(200).json({ text: response.text });
    } else {
        throw new Error("Invalid response structure from AI");
    }

  } catch (error) {
    res.status(500).json({ 
      message: "Failed to get chatbot response", 
      error: error.message 
    });
  }
};
