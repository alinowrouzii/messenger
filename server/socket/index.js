import { addUser, removeUser, getUser, users } from './dummyUsers.js'

const socketConfig = (io, sessionMiddleware, passport) => {

    // convert a connect middleware to a Socket.IO middleware
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

    io.use(wrap(sessionMiddleware));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    io.use((socket, next) => {
        if (socket.request.user) {
            console.log('socket connected succefully!')
            next();
        } else {
            console.log('failed in connecting socket')
            next(new Error('unauthorized user!! --In-socket--'))

        }
    });


    io.on('connect', (socket) => {
        // console.log(`new connection ${socket.id}`);
        
        socket.on('whoami', (cb) => {
            cb(socket.request.user ? socket.request.user.username : '');
        });


        socket.on("sendMessage", ({ sender, receiver, text }) => {
            console.log('message is sending...');
            console.log('users: ', users);
            console.log(new Date());
            console.log('---------------')
            const user = getUser(receiver);
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    sender,
                    text,
                });
            }
        });


        socket.on("addUser", (userId, name) => {
            //try to add user
            console.log('--------try to add user---------')
            console.log(users);
            addUser(userId, socket.id, name);
            console.log(users);
            console.log('--------------------------------')
            io.emit("getUsers", users);
        });

        // socket.on("disconnect", () => console.log("closed connection\n-------------------------------"))

        // when disconnect
        socket.on("disconnect", () => {
            console.log("user disconnected!");
            console.log('---------------try to deleting-------------')
            console.log(users);
            removeUser(socket.id);
            console.log(socket.id);
            console.log(users);
            console.log('-------------------------------------------')

            io.emit("getUsers", users);
        });

        //It should be removed i think!!
        const session = socket.request.session;
        console.log(`saving sid ${socket.id} in session ${session.id}`);
        session.socketId = socket.id;
        session.save();
    });
}

export default socketConfig;