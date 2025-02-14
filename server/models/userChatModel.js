import mongoose from "mongoose";

const UserChatSchema = new mongoose.Schema({
    sender:{type:String,required:true},
    lastActive:{type:Date,default:Date.now},
    
})

const UserChatModel = mongoose.model("userchat",UserChatSchema)

export default UserChatModel;