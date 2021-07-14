import express from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
export const getChats = async (req, res) => {

    const currentUser = await User.findById(req.user._id);
    const chats_Id = currentUser.chats;

    const chats_Id_Objects = chats_Id.map(x => mongoose.Types.ObjectId(x));
    Chat.find({
        '_id': {
            $in: chats_Id_Objects
        }
    }, (err, chats) => {
        if (err) {
            return res.status(502).send('Database error!');
        }
        console.log('successfull!!!!!!!')
        return res.status(200).json(chats);
    });
};

export const createChat = async (req, res) => {
    const { userId } = req.body;
    const userTwoId = req.user._id;

    const user = await User.findById(mongoose.Types.ObjectId(userId));
    const userTwo = await User.findById(mongoose.Types.ObjectId(userTwoId));
    if(user && userTwo){
        try {
            const newChat = new Chat({ users: [userId, userTwoId] });
            await newChat.save();
            
            user.chats.push(newChat._id.toString());
            await user.save();

            userTwo.chats.push(newChat._id.toString());
            await userTwo.save();

            return res.status(200).send('New chat was created');
        } catch (err) {
            console.log(err);
            return res.status(502).send('Database error!');
        }
    }else{
        return res.status(404).send('User not found!');
    }
};