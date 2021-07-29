import { io } from "socket.io-client";
import { URL } from './constants/index';

const socket = io(URL, {
    autoConnect: false,
    // withCredentials: true,
    transports: ['websocket']
});

export default socket;

