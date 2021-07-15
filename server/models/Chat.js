import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    users: {
        type: [mongoose.Types.ObjectId],//holds two userId
        ref:'User',
        validate: [( arr=> arr.length <=2), 'array size should be 2 !']
    }
},{ timestamps: true });

// const arrayLimit = (arr) => {
//     return arr.length <= 2;
// }

var Chat = mongoose.model('Chat', chatSchema);

export default Chat;