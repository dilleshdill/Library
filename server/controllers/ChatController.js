import chatModel from "../models/chatModel.js";

const createChat =async (req,res)=>{
    const newChat = new chatModel({
        members:[req.body.senderId,req.body.receiverId]
    });

    try{
        const savedChat = await newChat.save();
        res.status(200).json(savedChat);
    }catch(e){
        res.status(500).json(e);
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

export {createChat,userChats,findChat};