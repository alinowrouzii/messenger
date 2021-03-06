import {
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAIL,
    SET_MESSAGE_READY,
    ADD_NEW_MESSAGE_NOTIF,
    LOGOUT,
    REMOVE_NEW_MESSAGE_NOTIF,
    SET_NEW_MESSAGE_NOTIF,
    SEND_MESSAGE,
    ADD_MESSAGE_FROM_SOCKET
} from "../actions/types";

const initialState = { messages: [], messageInfo: "", messagesIsReady: false, newMessagesNotification: [] };

export default (state = initialState, action) => {
    const { type, payload } = action;
    // console.log(type, payload);

    switch (type) {
        case SEND_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, payload.newMessage],
            };
        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                messages: state.messages.map(message => {
                    if (message.tempId === payload.tempId) {
                        //pending=false means message is sent
                        message._id = payload.realId;

                        message.pending = false;
                        message.createdAt = Date.now();
                        return message;
                    }
                    return message;
                })
            }
        // return {
        //     ...state,
        //     messages: [...state.messages, payload.newMessage],
        //     messageInfo: payload.messageInfo
        // };
        case SEND_MESSAGE_FAIL:
            return {
                ...state,
                messageInfo: payload.messageInfo
            };
        case GET_MESSAGES_SUCCESS:
            return {
                ...state,
                messages: payload.messages,
                messageInfo: payload.messageInfo
            };
        case GET_MESSAGES_FAIL:
            return {
                ...state,
                messageInfo: payload.messageInfo
            };
        case SET_MESSAGE_READY:
            return {
                ...state,
                messagesIsReady: payload.isReady
            };
        case SET_NEW_MESSAGE_NOTIF:
            return {
                ...state,
                newMessagesNotification: payload.users
            };
        case ADD_NEW_MESSAGE_NOTIF:
            let user = state.newMessagesNotification.find(el => el === payload.user);

            if (user) {
                return state;
            }
            return {
                ...state,
                newMessagesNotification: [...state.newMessagesNotification, payload.user]
            };
        case REMOVE_NEW_MESSAGE_NOTIF:
            return {
                ...state,
                newMessagesNotification: state.newMessagesNotification.filter(el => el !== payload.user)
            };
        case ADD_MESSAGE_FROM_SOCKET:
            return {
                ...state,
                messages: [...state.messages, payload.newMessage],
            };

        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}