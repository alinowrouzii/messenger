import mongoose from 'mongoose';
import User from '../models/User.js';
import multerConfig from '../config/multer.js';
import multer from 'multer';
import mime from 'mime-types';
import fse from 'fs-extra';



import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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



export const getProfilePhoto = async (req, res) => {

    console.log('hey')
    try {
        const ownUserId = req.user._id;

        const userId = mongoose.Types.ObjectId(req.params.userId);

        try {

            const currentUser = await User.findById(userId).select('+friends');

            if (!currentUser) {
                return res.status(404).json({ message: 'User not found!' });
            }
          
            if (!ownUserId.equals(userId) && !currentUser.friends.some(u => u._id.equals(ownUserId))) {
                return res.status(404).json({ message: 'Media not found!' });
            }

            let filePath = '/uploads';


            if (!currentUser.profilePhotoName) {
                res.setHeader('Content-disposition', 'attachment; filename=no-profile');
                res.setHeader('Content-type', '	image/jpeg');

                filePath = path.join(__dirname, '..', filePath, 'template/no-profile.jpg');

                const filestream = fse.createReadStream(filePath);
                filestream.pipe(res);
                return;
            }

            const file = currentUser.profilePhotoName;
            const filename = path.basename(file);
            const mimetype = mime.lookup(file);

            filePath = path.join(__dirname, '..', filePath, 'users', userId.toString(), 'profile', file);

            fse.stat(filePath, function (err) {
                if (err == null) {
                    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                    res.setHeader('Content-type', mimetype);

                    const filestream = fse.createReadStream(filePath);
                    filestream.pipe(res);
                    return;
                } else if (err.code === 'ENOENT') {
                    console.log('not found!')
                    console.log(filePath);
                    return res.status(404).json({ message: 'Media not found!' });
                    // return resolve
                    (false);
                } else {
                    return reject(err);
                }
            })

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


export const setProfilePhoto = async (req, res) => {

    const userId = req.user._id;

    try {


        try {

            let dest = '/uploads/users';
            dest = path.join(__dirname, '..', dest, userId.toString(), 'profile');
            console.log(dest);
            // image max size is 3MB
            const maxSize = 3 * 1024 * 1024;
            const acceptableTypes = ['jpg', 'jpeg', 'png'];
            const upload = multerConfig(dest, maxSize, acceptableTypes);

            upload.single('profile-image')(req, res, async function (err) {
                if (err) {
                    console.log(err.message || err.msg);
                    if (err instanceof multer.MulterError) {
                        console.log('1');

                        return res.status(406).json({ message: `upload failed! due to an error: ${err.message}` });
                    }

                    if (err.msg === 'File too large') {
                        return res.status(413).json({ message: `File is larger than ${maxSize / (1024 * 1024)}MB` });
                    }
                    return res.status(406).json({ message: `upload failed! due to an error: ${err.message || err.msg}` });
                }
                //means successfull upload!
                console.log('file uploaded!');

                if (!req.file) {
                    return res.status(406).json({ message: 'Upload failed!' });
                }

                const filename = req.file.filename;

                const user = await User.findById(userId);

                if (!user) {
                    return res.status(404).json({ message: 'User not found!' });

                }
                user.profilePhotoName = filename;
                await user.save();

                return res.status(201).json({
                    message: 'Profile image uploaded!!'
                });
            });
        } catch (err) {
            console.log(err);
            return res.status(502).json({ messageInfo: 'DataBase error on creating message' });
        }

    } catch (err) {
        res.status(400).json({
            messageInfo: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
        });
    }

}
