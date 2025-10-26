import chatModel from "../models/chatModel.js";

const createChat = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        // Check if a chat between sender and receiver already exists
        const existingChat = await chatModel.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (existingChat) {
            return res.status(200).json({ message: "Chat already exists", chat: existingChat });
        }

        // If no existing chat, create a new one
        const newChat = new chatModel({
            members: [senderId, receiverId]
        });

        const savedChat = await newChat.save();
        res.status(200).json(savedChat);

    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


const userChats = async (req,res)=>{
    try{
        const chat = await chatModel.find({
            members:{$in:[req.params.userId]}
        })
        res.status(200).json(chat);
    }
    catch(e){
        res.status(500).json(e);
    }
};

const findChat = async (req,res)=>{
    try{
        const chat = await chatModel.findOne({
            members:{$all:[req.params.firstUserId,req.params.secondUserId]}
        })
        res.status(200).json(chat);
    }
    catch(e){
        res.status(500).json(e);
    }
}

const getChatById = async (req, res) => {
    try {
      console.log("Chat ID:", req.params.id);
      const {chatId} = req.params.id;
      const chat = await chatModel.findById(chatId);
      if (!chat) {
        console.warn("Chat not found for ID:", req.params.id);
        return res.status(400).json({ message: "Chat not found" });
      }
      console.log("Chat data:", chat);
      res.status(200).json(chat);
    } catch (e) {
      console.error("Error fetching chat:", e);
      res.status(500).json({ message: "Internal server error", error: e.message });
    }
  };
  
  

export {createChat,userChats,findChat,getChatById};