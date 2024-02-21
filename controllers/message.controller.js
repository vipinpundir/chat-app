const Conversation = require("../models/conversation.model");
const Message = require('../models/message.model')

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

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
