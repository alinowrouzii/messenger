
import { fetchChats, createChat as create_chat } from './../../api/chat.js'
import {
    GET_CHATS_SUCCESS,
    GET_CHATS_FAIL,
    CREATE_CHAT_SUCCESS,
    CREATE_CHAT_FAIL,
    SET_CHATS_READY
} from "./types";

export const createChat = (userId) => (dispatch) => {
    return create_chat({ userId, }).then(
        (response) => {
            dispatch({
                type: CREATE_CHAT_SUCCESS,
                payload: {
                    chat: response.data.chat,
                    message: response.data.message
                }
            });
            dispatch({
                type: SET_CHATS_READY,
                payload: {
                    isReady: true
                }
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: CREATE_CHAT_FAIL,
                payload: { message, },
            });

            return Promise.reject();
        }
    );
};

export const getChats = () => (dispatch) => {
    return fetchChats().then(
        (response) => {
            console.log(response.data)
            dispatch({
                type: GET_CHATS_SUCCESS,
                payload: {
                    chats: response.data.chats,
                    message: ""
                },
            });

            dispatch({
                type: SET_CHATS_READY,
                payload: {
                    isReady: true
                }
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: GET_CHATS_FAIL,
                payload: { message, }
            });
            return Promise.reject();
        }
    );
};