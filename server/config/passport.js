import LocalStrategy from 'passport-local';
import User from '../models/User.js';
import { validatePassword } from '../lib/passwordGenerator.js';

export const passportConfig = (passport) => {

    const strategy = new LocalStrategy.Strategy({}, async (username, password, done) => {

        try {
            const user = await User.findOne({ username: username }).select('+salt').select('+hash');

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isValid = validatePassword(password, user.hash, user.salt);

            if (isValid) {
                return done(null, user);
            }
            return done(null, false, { message: 'Incorrect password.' });
        } catch (err) {
            done(err);
        };

    });

    passport.use(strategy);

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (userId, done) => {
        try {
            const user = await User.findById(userId)
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}
