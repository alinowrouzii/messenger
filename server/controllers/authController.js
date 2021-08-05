import mongoose from 'mongoose';
import User from '../models/User.js';
import passport from 'passport';
import { generatePassword } from '../lib/passwordGenerator.js';
export const login = async (req, res, next) => {

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            // console.log(info)
            return res.status(401).json({message: info.message});
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
        console.log('logged out!!')
        req.logout();
        return res.status(200).json({ message: "User has been successfully logged out" });
    }
    return res.status(401).json({ message: 'you\'ve not logged in yet' });
}

export const signup = async (req, res) => {
    const { username, name, password } = req.body;

    const { salt, hash } = generatePassword(password);

    if (password.length === 0) {
        return res.status(400).json({ message: 'Password field is empty!!' });
    } else if (password.length < 6) {
        return res.status(400).json({ message: 'password should be at least 6 characters!!' });
    }

    try {

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'username exists' });
        }

        const newUser = new User({
            username, name, hash, salt, role:'restricted'
        });
        // username field should be unique(according to user schema)
        // so for duplicate usename we get an error message.
        await newUser.save();

        // passport.authenticate("local")(req, res, function () {
        return res.status(201).json({ message: 'you have been successfully signed up' });
        // });

    } catch (err) {
        console.log(err);
        res.status('502').json({ message: 'Database error!' });
    }
}

export const userIsLoggedIn = async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized!' });
}


export const isAdmin = async (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(401).json({ message: 'Premision denied!' });
}


