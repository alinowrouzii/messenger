import mongoose from 'mongoose';
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {

    const { text, sender, chat } = req.body;

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
                    return res.status(201).send('Message sent!');

                } else {
                    return res.status(404).send('Can\'t send message to other chat!');
                }

            } else {
                return res.status(404).send('Chat with that Id not found!');
            }

        } catch (err) {
            console.log(err);
            return res.status(502).send('DataBase error on creating message');
        }
    } else {
        return res.status(404).send('Can\'t send message with diffrenet id!');
    }

}

export const getMessages = async (req, res) => {

    const chatId = mongoose.Types.ObjectId(req.params.chatId);
    const userId = req.user._id;

    try {
        const currentUser = await User.findById(userId);

        //check that this chat is in user's chat list or not
        if (currentUser.chats.some(element => chatId.equals(element))) {
            const messages = await Message.find({ chat: chatId });

            return res.status(302).json(messages);
        } else {
            return res.status(404).send('This chat not found in your chat list!!')
        }
    } catch (err) {
        return res.status(502).send('DataBase error!');
    }

}