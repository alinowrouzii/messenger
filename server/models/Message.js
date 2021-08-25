import mongoose from 'mongoose';
import { AUDIO_MESSAGE_TYPE, TEXT_MESSAGE_TYPE,IMAGE_MESSAGE_TYPE } from './constants.js';

const options = {
    timestamps: true,
    // discriminatorKey: 'kind'
};

const messageSchema = new mongoose.Schema({
    // text: {
    //     type: String,
    //     required: true
    // },
    sender: {
        type: mongoose.Types.ObjectId,//holds user_Id
        ref: 'User'
    },
    chat: {
        type: mongoose.Types.ObjectId,//holds chat_ID
        ref: 'Chat'
    },

    kind: {
        type: String,
        enum: [AUDIO_MESSAGE_TYPE, TEXT_MESSAGE_TYPE,IMAGE_MESSAGE_TYPE],
        required: true
    },
    messageDataName: {
        type: String
    },
    text: {
        type: String,
        required: true
    }

}, options);


const Message = mongoose.model('Message', messageSchema);


// export const AudioMessage = Message.discriminator(AUDIO_MESSAGE_TYPE,
//     new mongoose.Schema({
//         audioName: {
//             type: String,
//             required: true
//         },
//     }, options));

// export const TextMessage = Message.discriminator(TEXT_MESSAGE_TYPE,
//     new mongoose.Schema({
//         data: {
//             type: String,
//             required: true
//         },
//     }, options));

export default Message;