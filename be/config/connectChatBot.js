const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.KeyChatBot;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

exports.handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ reply: "Bạn chưa nhập tin nhắn." });
  }

  try {
    const payload = {
      contents: [
        {
          parts: [{ text: `Bạn hãy trả lời bằng tiếng Việt: ${message}`}]
        }
      ]
    };

    const { data } = await axios.post(GEMINI_URL, payload);

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (!reply) {
      return res.status(500).json({ reply: "Chatbot không trả lời được. Vui lòng thử lại." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Xin lỗi, chatbot đang gặp sự cố. Vui lòng thử lại sau." });
  }
};
