import messageModel from "../models/messageModel.js";
import { io } from "../server.js"

// Add a new message
const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });

    io.to(chatId).emit("receive-message", message);
    const result = await message.save();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: "Error saving message", details: e.message });
  }
};

// Get all messages for a chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await messageModel.find({ chatId });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: "Error fetching messages", details: e.message });
  }
};

export { addMessage, getMessages };
