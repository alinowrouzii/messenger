import {
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAIL,
    SET_MESSAGE_READY,
    LOGOUT
} from "../actions/types";

const initialState = { messages: [], messageInfo: "", messagesIsReady: false };

export default (state = initialState, action) => {
    const { type, payload } = action;
    // console.log(type, payload);

    switch (type) {
        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                messages: [...state.messages, payload.newMessage],
                messageInfo: payload.messageInfo
            };
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
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}