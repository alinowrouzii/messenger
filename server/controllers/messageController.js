import mongoose from 'mongoose';
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {

    const { text, sender, chat_Id } = req.body;

    //check that loggedIn user_Id and sender User_Id mathched!
    
    if (sender === req.user._id.toString()) {
        const id = mongoose.Types.ObjectId(chat_Id);

        const fetchedChat = await Chat.findById(id);
        if (fetchedChat) {//there's exist chat with that chat_id
            if (fetchedChat.users.includes(sender)) {//sender is member of that chat or not
                try {
                    const msg = new Message({ text, sender, chat: chat_Id });
                    await msg.save();
                    return res.status(200).send('Message sent!');

                } catch (err) {
                    console.log(err);
                    return res.status(502).send('DataBase error ono creating message');
                }

            } else {
                return res.status(404).send('Can\'t send message to other chat!');
            }

        } else {
            return res.status(404).send('Chat with that Id not found!');
        }
    } else {
        return res.status(404).send('Can\'t send message with diffrenet id!');
    }

}

export const getMessages = async (req, res) => {

    const chatId = req.params.chatId;

    //check that this chat is in user's chat list or not
    const userId = req.user._id;
    const currentUser = await User.findById(userId);

    if (currentUser.chats.includes(chatId)) {

        Message.find({ chat: chatId }, (err, messages) => {
            if (err) {
                return res.status(502).send('DataBase error!');
            }

            // if (!messages.length) {
            //     return res.status(404).send('No message found!!')
            // } else {
            return res.status(200).json(messages);
            // }
        })
    } else {
        return res.status(404).send('This chat not found in your chat list!!')
    }
}