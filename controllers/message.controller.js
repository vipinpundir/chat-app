const Conversation = require("../models/conversation.model");
const Message = require('../models/message.model');
const { getReceiverSocketId, io } = require("../socket/socket");

const sendMessage = async (req, res) => {
    try {
        const { message, senderId } = req.body;
        const { id: receiverId } = req.params;
        // const senderId = req.user._id;
        
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // SOCKET IO FUNCTIONALITY WILL GO HERE 
        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverId){
            // io.to(socket_id).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        await Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in message controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.body.userId;

        const conversion = await Conversation.findOne({
            participants: {$all: [senderId, userToChatId]},
        }).populate("messages")

        if (!conversion) return res.status(200).json([]);

        res.status(200).json(conversion.messages)

    } catch (error) {
        console.log("Error in get message controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {sendMessage,getMessage}   ;
