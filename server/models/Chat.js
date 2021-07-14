import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    users: {
        type: [String],//holds two userId
        validate: [( arr=> arr.length <=2), 'array size should be 2 !']
    }
});

// const arrayLimit = (arr) => {
//     return arr.length <= 2;
// }

var Chat = mongoose.model('Chat', chatSchema);

export default Chat;