import mongoose from 'mongoose';
import multerConfig from '../config/multer.js';
import multer from 'multer';
import Chat from "../models/Chat.js";
import { AUDIO_MESSAGE_TYPE, TEXT_MESSAGE_TYPE, IMAGE_MESSAGE_TYPE } from '../models/constants.js';
import Message from "../models/Message.js";
import User from "../models/User.js";
import mime from 'mime-types';
import fse from 'fs-extra';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sendMessage = async (req, res) => {

    const { msg_type, chat, sender } = req.query;

    if (!chat || !sender || !msg_type) {
        return res.status(400).json({ messageInfo: 'all input is required!' });
    }

    try {
        const senderId = mongoose.Types.ObjectId(sender);
        const chatId = mongoose.Types.ObjectId(chat);
        //check that loggedIn user_Id and sender User_Id mathched!

        if (senderId.equals(req.user._id)) {
            try {
                const fetchedChat = await Chat.findById(chatId);
                if (fetchedChat) {//there's exist chat with that chat_id

                    if (fetchedChat.users.some(element => senderId.equals(element))) {//sender is member of that chat or not

                        if (msg_type === AUDIO_MESSAGE_TYPE || msg_type === IMAGE_MESSAGE_TYPE) {

                            let dest = '/uploads/chats';
                            dest = path.join(__dirname, '..', dest, chat, msg_type);
                            console.log(dest);
                            // audio max size is 3MB
                            const maxSize = 3 * 1024 * 1024;
                            const acceptableTypes = (msg_type === AUDIO_MESSAGE_TYPE) ? ['ogg', 'webm', 'weba'] : ['jpg', 'jpeg', 'png', 'webp'];
                            const upload = multerConfig(dest, maxSize, acceptableTypes);

                            upload.single(msg_type)(req, res, async function (err) {
                                if (err) {
                                    console.log(err.message || err.msg);
                                    if (err instanceof multer.MulterError) {
                                        console.log('1');

                                        return res.status(406).json({ messageInfo: `upload failed! due to an error: ${err.message}` });
                                    }

                                    if (err.msg === 'File too large') {
                                        return res.status(413).json({ messageInfo: `File is larger than ${maxSize / (1024 * 1024)}MB` });
                                    }
                                    return res.status(406).json({ messageInfo: `upload failed! due to an error: ${err.message || err.msg}` });
                                }
                                //means successfull upload!
                                console.log('file uploaded!');

                                if (!req.file) {
                                    return res.status(406).json({ messageInfo: 'Upload failed!' });
                                }

                                const filename = req.file.filename;

                                const { text } = req.body;
                                const msg = new Message({
                                    text,
                                    messageDataName: filename,
                                    sender: senderId,
                                    chat: chatId,
                                    kind: msg_type
                                });
                                await msg.save();

                                return res.status(201).json({
                                    messageInfo: 'Message created!',
                                    messageId: msg._id
                                });

                            });
                        } else if (msg_type === TEXT_MESSAGE_TYPE) {

                            const { text } = req.body;

                            const msg = new Message({
                                text,
                                sender: senderId,
                                chat: chatId,
                                kind: TEXT_MESSAGE_TYPE
                            });

                            await msg.save();
                            return res.status(201).json({
                                messageInfo: 'Message created!',
                                messageId: msg._id
                            });
                        }

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
            messageInfo: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
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
            console.log(err)
            return res.status(502).json({ messageInfo: 'DataBase error!' });
        }

    } catch (err) {
        res.status(400).json({
            message: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
        });
    }
}

export const uploadTest = (req, res) => {

}

export const getMedia = async (req, res) => {

    // setTimeout(async () => {
    try {
        const chatId = mongoose.Types.ObjectId(req.params.chatId);
        const messageId = mongoose.Types.ObjectId(req.params.msgId);
        const userId = req.user._id;

        try {
            const currentUser = await User.findById(userId).select('+chats');

            //check that this chat is in user's chat list or not
            if (currentUser.chats.some(element => chatId.equals(element))) {
                const message = await Message.findOne({ chat: chatId, _id: messageId });

                if (!message || (message.kind !== AUDIO_MESSAGE_TYPE && message.kind !== IMAGE_MESSAGE_TYPE)) {
                    return res.status(404).json({ messageInfo: 'message no found!' });
                }

                const file = message.messageDataName;
                const filename = path.basename(file);
                const mimetype = mime.lookup(file);

                let filePath = '/uploads/chats';
                const chat = req.params.chatId;
                filePath = path.join(__dirname, '..', filePath, chat, message.kind, file);

                fse.stat(filePath, function (err) {
                    if (err == null) {
                        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                        res.setHeader('Content-type', mimetype);

                        const filestream = fse.createReadStream(filePath);
                        filestream.pipe(res);
                        return;
                    } else if (err.code === 'ENOENT') {
                        console.log('not found!')
                        return res.status(404).json({ message: 'Media not found!' });
                        // return resolve
                        (false);
                    } else {
                        return reject(err);
                    }
                })


            } else {
                return res.status(404).json({ messageInfo: 'This chat not found in your chat list!!' })
            }
        } catch (err) {
            console.log(err)
            return res.status(502).json({ messageInfo: 'DataBase error!' });
        }

    } catch (err) {
        res.status(400).json({
            message: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
        });
    }
    // }, 5000);
}