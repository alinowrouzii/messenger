import mongoose from 'mongoose';
import User from '../models/User.js';

export const getMe = async (req, res) => {

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (user) {
            return res.status(302).json({user,});
        }
        return res.status(404).json({ message: 'user not found!' });
    } catch (err) {
        return res.status(502).json({ message: 'DataBase error.' });
    }
}

export const getUserData = async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId);

    try {
        const user = await User.findById(userId, { chats: 0, friends: 0 });
        if (user) {
            return res.status(302).json({user,});
        }
        return res.status(404).json({ message: 'user not found!' });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'DataBase error.' });
    }
}
