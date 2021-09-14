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
            console.log(socket.id)
            console.log('------------------------')
            next(new Error('connect err'));
            // next(new Error('unauthorized user!! --In-socket--'))

        }
    });


    io.on('connect', (socket) => {
        // console.log(`new connection ${socket.id}`);

        socket.on('whoami', (cb) => {
            cb(socket.request.user ? socket.request.user.username : '');
        });


        socket.on("sendMessage", ({ receiver, ...newMessage }) => {
           
            const sender = socket.request.user;
            if (sender._id.toString() === newMessage.sender) {

                const user = getUser(receiver);
                if (user) {
                    io.to(user.socketId).emit("getMessage", newMessage);
                }
            }
        });

        socket.on("isTyping", (receiver) => {
            const user = getUser(receiver);
            const ownUser = socket.request.user;
            // console.log('ownuser', ownUser);
            if (user) {
                io.to(user.socketId).emit("isTyping", {
                    typingUser: ownUser._id.toString()
                });
            }
        });

        socket.on("stopTyping", (receiver) => {
            const user = getUser(receiver);
            const ownUser = socket.request.user;
            // console.log(typeof ownUser)
            if (user) {
                io.to(user.socketId).emit("stopTyping", {
                    typingUser: ownUser._id.toString()
                });
            }
        });

        // when disconnect
        socket.on("disconnect", () => {
            console.log("user disconnected!");
            console.log('---------------try to deleting-------------');
            console.log(users);
            removeUser(socket.id);
            console.log(socket.id);
            console.log(users);

            console.log('-------------------------------------------');

            //TODO: find all friends of this user. and then emit getUsers to user online friends!!
            //and then filter users array by friends of each users

            //1-first specify that which users should recive getUsers event
            //2-then specify that which users should be sent to that specified user

            io.emit("getUsers", users);
        });


        //try to add user
        const session = socket.request.session;
        session.socketId = socket.id;
        session.save();

        const ownUser = socket.request.user;
        const userId = ownUser._id.toString();
        const name = ownUser.name;
        addUser(userId, socket.id, name);
        io.emit("getUsers", users);
    });
}

export default socketConfig;