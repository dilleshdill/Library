import express from "express";
import { createChat, userChats, findChat,getChatById } from "../controllers/ChatController.js";
const chatRouter = express.Router();

chatRouter.post("/",createChat);
chatRouter.get("/:userId",userChats);
chatRouter.get("/:chatId", getChatById);
chatRouter.get("/find/:firstUserId/:secondUserId",findChat); 
export default chatRouter;