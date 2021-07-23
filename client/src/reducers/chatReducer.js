import {
    CREATE_CHAT_SUCCESS,
    CREATE_CHAT_FAIL,
    GET_CHATS_SUCCESS,
    GET_CHATS_FAIL,
    LOGOUT
} from "../actions/types";

const initialState = { chats: [], chatMessage: "" };

export default (state = initialState, action) => {
    const { type, payload } = action;
    console.log(type, payload);

    switch (type) {
        case CREATE_CHAT_SUCCESS:
            return {
                ...state,
                chats: [...state.chats, payload.chat],
                chatMessage: payload.message
            };
        case CREATE_CHAT_FAIL:
            return {
                ...state,
                chatMessage: payload.message
            };
        case GET_CHATS_SUCCESS:
            return {
                ...state,
                chats: payload.chats,
                chatMessage: payload.message
            };
        case GET_CHATS_FAIL:
            return {
                ...state,
                chatMessage: payload.message
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}