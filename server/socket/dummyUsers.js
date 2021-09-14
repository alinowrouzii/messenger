export let users = [];


export const addUser = (userId, socketId, name) => {
    const user = users.find((user) => user._id === userId);
    
    if (user) {
        user.socketId = socketId;
    }
    else {
        users.push({ _id: userId, socketId, name });
    }
};

export const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

export const getUser = (userId) => {
    return users.find((user) => user._id === userId);
};