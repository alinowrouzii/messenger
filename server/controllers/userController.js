import mongoose from 'mongoose';
import User from '../models/User.js';
import passport from 'passport';

export const login = async (req, res, next) => {

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send('Failed to authentication');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).json(req.user);
        });
    })(req, res, next);

    // res.status(200).json(req.user);
}

export const logout = async (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        return res.status(200).send("User has been successfully logged out");
    }
    return res.status(401).send('you\'ve not logged in yet');
}

export const signup = async (req, res) => {
    const { username, name, password } = req.body;
    // console.log(username, name, password);
    User.register(new User({ username, name }), password, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(401).send('Registration failed!!');
        }
        passport.authenticate("local")(req, res, function () {
            return res.status(200).json(user);
        });
    });
}

export const getUserData = async (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId);

    try {
        const user = await User.findById(userId);
        if (user) {
            if(user.friends.some(element => req.user._id.equals(element))){
                return res.status(302).json(user);
            }
            return res.status(404).send('user is not in ur friend\'s list');
        }
        return res.status(404).send('user not found!');
    } catch (err) {
        return res.status(502).send('DataBase error.');
    }
}

export const userIsLoggedIn = async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized!');
}