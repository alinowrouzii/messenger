
import { sendMessage as send_message, getMessages as get_messages } from './../api/message.js'
import {
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAIL
} from "./types";

export const sendMessage = (text, sender, chatId) => (dispatch) => {
    return send_message({ text, sender, chat: chatId }).then(
        (response) => {
            dispatch({
                type: SEND_MESSAGE_SUCCESS,
                payload: { message: response.data.message }
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
                type: SEND_MESSAGE_FAIL,
                payload: { message, },
            });

            return Promise.reject();
        }
    );
};

export const getMessages = (chatId) => (dispatch) => {
    return get_messages(chatId).then(
        (response) => {
            console.log(response.data)
            dispatch({
                type: GET_MESSAGES_SUCCESS,
                payload: { messages: response.data.messages },
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
                type: GET_MESSAGES_FAIL,
                payload: { message, }
            });
            return Promise.reject();
        }
    );
};