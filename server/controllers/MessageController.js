import messageModel from "../models/messageModel.js";

const addMessage = async (req,res)=>{
    const {chatId,senderId,text} = req.body;
    const message = new messageModel({
        chatId,
        senderId,
        text,
    })
    try{
        const result = await message.save();
        res.status(200).json(result);
    }
    catch(e){
        res.status(500).json(e);
    }
}

const getMessages = async (req,res)=>{
    const {chatId} = req.params;

    try{
        const result = await messageModel.find({chatId})
        res.status(200).json(result);
    }
    catch(e){
        res.status(500).json(e);
    }
}

export {addMessage,getMessages};