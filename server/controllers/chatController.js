import mongoose from 'mongoose';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
export const getChats = async (req, res) => {

    try {
        const currentUser = await User.findById(req.user._id)
            .populate('chats')
            .exec();

        return res.status(302).json({ chats: currentUser.chats });
    } catch (err) {
        return res.status(502).json({ message: 'Database error!' });
    }
};

export const createChat = async (req, res) => {
    const { userId } = req.body;
    const userOneId = mongoose.Types.ObjectId(userId)
    const userTwoId = req.user._id;

    try {
        const userOne = await User.findById(userOneId);
        const userTwo = await User.findById(userTwoId);
        if (userOne && userTwo) {
            if (!userOne.friends.some(element => userTwoId.equals(element))) {
                const newChat = new Chat({ users: [userOneId, userTwoId] });
                await newChat.save();

                userOne.chats.push(newChat._id);
                userOne.friends.push(userTwoId);
                await userOne.save();

                userTwo.chats.push(newChat._id);
                userTwo.friends.push(userOneId);
                await userTwo.save();

                return res.status(201).json({ message: 'New chat was created' });
            } else {
                return res.status(400).json({ message: 'User already has a chat with given user!' });
            }
        } else {
            return res.status(404).json({ message: 'User not found!' });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'Database error!' });
    }
};