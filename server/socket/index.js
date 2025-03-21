import { Server } from "socket.io";

const setUpSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected: ", socket.id);

        socket.on("join",(chatId)=>{
            socket.chatId = chatId
            socket.join(chatId)
        })

        socket.on("disconnect", () => {
            console.log("Socket disconnected: ", socket.id);
        });

        socket.emit("connection", "successfully connected");
    });
};

export default setUpSocket;