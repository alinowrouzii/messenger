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


        socket.on("sendMessage", ({ receiver, data, kind }) => {
            console.log('message is sending...');
            console.log('users: ', users);
            console.log(socket.id)
            console.log(new Date());
            console.log('---------------')

            const sender = socket.request.user;
            const user = getUser(receiver);
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    sender: sender._id.toString(),
                    data, kind
                });
            }
        });

        //TODO: get userId from session and then add user with that id
        // socket.on("addUser", (userId, name) => {
        //     //try to add user
        //     console.log('--------try to add user---------')
        //     console.log(new Date());
        //     console.log(users);
        //     console.log('type of userId', typeof userId);
        //     addUser(userId, socket.id, name);
        //     console.log(users);
        //     console.log('--------------------------------')
        //     io.emit("getUsers", users);
        // });


        socket.on("isTyping", (receiver) => {
            const user = getUser(receiver);
            const ownUser = socket.request.user;
            // console.log('ownuser', ownUser);
            if (user) {
                console.log('send typing')
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
                console.log('send stop typing')
                io.to(user.socketId).emit("stopTyping", {
                    typingUser: ownUser._id.toString()
                });
            }
        });

        // socket.on("send-audio", ({ buffer, reciever }) => {
        //     const user = getUser(reciever);
        //     const ownUser = socket.request.user;
        //     // console.log('ownuser', ownUser);
        //     if (user) {
        //         console.log('sending audio file')
        //         io.to(user.socketId).emit("get-audio", {
        //             sender: ownUser._id.toString(),
        //             buffer
        //         });
        //     }
        // });



        // socket.on("disconnect", () => console.log("closed connection\n-------------------------------"))

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
        console.log('--------try to add user---------');

        const session = socket.request.session;
        console.log(`saving sid ${socket.id} in session ${session.id}`);
        session.socketId = socket.id;
        session.save();

        console.log(new Date());
        console.log(users);
        const ownUser = socket.request.user;
        const userId = ownUser._id.toString();
        const name = ownUser.name;
        console.log('type of userId', typeof userId);
        addUser(userId, socket.id, name);
        console.log(users);
        console.log('--------------------------------')
        io.emit("getUsers", users);
    });
}

export default socketConfig;