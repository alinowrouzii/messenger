import mongoose from 'mongoose';
import User from '../models/User.js';

export const getMe = async (req, res) => {

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (user) {
            return res.status(200).json({ user, });
        }
        return res.status(404).json({ message: 'user not found!' });
    } catch (err) {
        return res.status(502).json({ message: 'DataBase error.' });
    }
}

export const getUserData = async (req, res) => {

    try {
        const userId = mongoose.Types.ObjectId(req.params.userId);

        try {

            const user = await User.findById(userId);
            if (user) {
                return res.status(200).json({ user, });
            }
            return res.status(404).json({ message: 'user not found!' });
        } catch (err) {
            console.log(err);
            return res.status(502).json({ message: 'DataBase error.' });
        }

    } catch (err) {
        res.status(400).json({
            message: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
        });
    }

}

export const getUsersData = async (req, res) => {

    if (!req.query.username && !req.query.name) {
        return res.status(400).json({ message: 'query not found!!' });
    }

    try {
        if (req.query.username) {

            const queryValue = req.query.username;

            const users = await User.find({
                username: { "$regex": queryValue, "$options": "i" }
            });

            return res.status(200).json({ users, });

        } else {
            const queryValue = req.query.name;

            const users = await User.find({
                name: { "$regex": queryValue, "$options": "i" }
            });

            return res.status(200).json({ users, });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: 'DataBase error.' });
    }
}
