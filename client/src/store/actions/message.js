
import FormData from "form-data";

import { sendTextMessage as send_text_message, sendMediaMessage as send_media_message, getMessages as get_messages } from './../../api/message.js'
import {
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAIL,
    SET_MESSAGE_READY,
    SEND_MESSAGE
} from "./types";

export const sendMessage = (newMsg) => (dispatch) => {

    const { data, ...msg } = newMsg;
    const kind = msg.kind;
    if (kind === 'AUDIO_MESSAGE' || kind === 'IMAGE_MESSAGE') {


        const form = new FormData();
        form.append(kind, data);
        form.append('text', msg.text.length === 0 ? ' ' : msg.text);

        const url = window.URL.createObjectURL(data);
        dispatch({
            type: SEND_MESSAGE,
            payload: {
                newMessage: { url, ...msg }
            }
        });

        return send_media_message({ form, ...msg }).then(
            (response) => {
                dispatch({
                    type: SEND_MESSAGE_SUCCESS,
                    payload: {
                        messageId: msg._id,
                        messageInfo: response.data.messageInfo
                    }
                });

                dispatch({
                    type: SET_MESSAGE_READY,
                    payload: {
                        isReady: true
                    }
                });

                return Promise.resolve({ messageId: response.data.messageId });
            },
            (error) => {
                const messageInfo =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                dispatch({
                    type: SEND_MESSAGE_FAIL,
                    payload: { messageInfo, },
                });

                return Promise.reject();
            }
        );

    } else {

        dispatch({
            type: SEND_MESSAGE,
            payload: {
                newMessage: msg
            }
        });

        return send_text_message(msg).then(
            (response) => {
                dispatch({
                    type: SEND_MESSAGE_SUCCESS,
                    payload: {
                        messageId: msg._id,
                        messageInfo: response.data.messageInfo
                    }
                });

                dispatch({
                    type: SET_MESSAGE_READY,
                    payload: {
                        isReady: true
                    }
                });

                return Promise.resolve({ messageId: response.data.messageId });
            },
            (error) => {
                const messageInfo =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                dispatch({
                    type: SEND_MESSAGE_FAIL,
                    payload: { messageInfo, },
                });

                return Promise.reject();
            }
        );
    }
};

export const getMessages = (chatId) => (dispatch) => {
    return get_messages(chatId).then(
        (response) => {
            console.log(response.data)
            dispatch({
                type: GET_MESSAGES_SUCCESS,
                payload: {
                    messages: response.data.messages,
                    messageInfo: ""
                },
            });

            dispatch({
                type: SET_MESSAGE_READY,
                payload: {
                    isReady: true
                }
            });
            return Promise.resolve();
        },
        (error) => {
            const messageInfo =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: GET_MESSAGES_FAIL,
                payload: { messageInfo, }
            });
            return Promise.reject();
        }
    );
};
