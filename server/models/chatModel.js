import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    sender:{type:String,required:true},
    receiver:{type:String,required:true},
    chatList:[
        {
            message:{type:String,required:true},
            sender:{type:String,required:true},
            timeStamp:{type:Date,default:Date.now}
        }
    ]
})

const ChatModel = mongoose.model("chat",ChatSchema)

export default ChatModel;