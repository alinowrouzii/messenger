import mongoose from 'mongoose';
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {

    const { text, sender, chat } = req.body;

    try {
        const senderId = mongoose.Types.ObjectId(sender);
        const chatId = mongoose.Types.ObjectId(chat);
        //check that loggedIn user_Id and sender User_Id mathched!

        if (senderId.equals(req.user._id)) {
            try {
                const fetchedChat = await Chat.findById(chatId);
                if (fetchedChat) {//there's exist chat with that chat_id

                    if (fetchedChat.users.some(element => senderId.equals(element))) {//sender is member of that chat or not

                        const msg = new Message({ text, sender: senderId, chat: chatId });
                        await msg.save();
                        return res.status(201).json({
                            messageInfo: 'Message sent!',
                            message: msg
                        });
                    } else {
                        return res.status(404).json({ messageInfo: 'Can\'t send message to other chat!' });
                    }
                } else {
                    return res.status(404).json({ messageInfo: 'Chat with that Id not found!' });
                }

            } catch (err) {
                console.log(err);
                return res.status(502).json({ messageInfo: 'DataBase error on creating message' });
            }
        } else {
            return res.status(404).json({ messageInfo: 'Can\'t send message with diffrenet id!' });
        }
    } catch (err) {
        res.status(400).json({
            message: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
        });
    }

}

export const getMessages = async (req, res) => {

    try {
        const chatId = mongoose.Types.ObjectId(req.params.chatId);
        const userId = req.user._id;

        try {
            const currentUser = await User.findById(userId).select('+chats');

            //check that this chat is in user's chat list or not
            if (currentUser.chats.some(element => chatId.equals(element))) {
                const messages = await Message.find({ chat: chatId });

                return res.status(200).json({ messages, });
            } else {
                return res.status(404).json({ messageInfo: 'This chat not found in your chat list!!' })
            }
        } catch (err) {
            return res.status(502).json({ messageInfo: 'DataBase error!' });
        }

    } catch (err) {
        res.status(400).json({
            message: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
        });
    }
}