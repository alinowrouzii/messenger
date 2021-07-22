import mongoose from 'mongoose';
import User from '../models/User.js';
import passport from 'passport';
import { generatePassword } from './../lib/passwordGenerator.js';
export const login = async (req, res, next) => {

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send(info);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ user, message: 'you have been successfully logged in' });
        });
    })(req, res, next);
}

export const logout = async (req, res) => {
    if (req.isAuthenticated()) {
        // console.log(req.user)
        req.logout();
        return res.status(200).send({ message: "User has been successfully logged out" });
    }
    return res.status(401).send({ message: 'you\'ve not logged in yet' });
}

export const signup = async (req, res) => {
    const { username, name, password } = req.body;

    const { salt, hash } = generatePassword(password);

    try {

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).send({ message: 'username exists' });
        }

        const newUser = new User({
            username, name, hash, salt
        });
        // username field should be unique(according to user schema)
        // so for duplicate usename we get an error message.
        await newUser.save();

        // passport.authenticate("local")(req, res, function () {
        return res.status(201).send('you have been successfully signed up');
        // });

    } catch (err) {
        res.status('502').send({ message: 'Database error!' });
    }
}


export const getMe = async (req, res) => {

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (user) {
            return res.status(302).json(user);
        }
        return res.status(404).send({ message: 'user not found!' });
    } catch (err) {
        return res.status(502).send({ message: 'DataBase error.' });
    }
}

export const getUserData = async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId);

    try {
        const user = await User.findById(userId, { chats: 0, friends: 0 });
        if (user) {
            return res.status(302).json(user);
        }
        return res.status(404).send({ message: 'user not found!' });
    } catch (err) {
        console.log(err);
        return res.status(502).send({ message: 'DataBase error.' });
    }
}

export const userIsLoggedIn = async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send({ message: 'Unauthorized!' });
}