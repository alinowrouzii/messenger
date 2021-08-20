
import FormData from "form-data";

import { sendTextMessage as send_text_message, sendAudioMessage as send_audio_message, getMessages as get_messages } from './../../api/message.js'
import {
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAIL,
    SET_MESSAGE_READY
} from "./types";

export const sendMessage = (data, sender, chatId, msg_type) => (dispatch) => {

    if (msg_type === 'AUDIO_MESSAGE') {

        const form = new FormData();

        form.append('voice', data);

        return send_audio_message({ form, sender, chat: chatId, msg_type }).then(
            (response) => {
                dispatch({
                    type: SEND_MESSAGE_SUCCESS,
                    payload: {
                        newMessage: response.data.message,
                        messageInfo: response.data.messageInfo
                    }
                });

                dispatch({
                    type: SET_MESSAGE_READY,
                    payload: {
                        isReady: true
                    }
                });

                return Promise.resolve(response.data.message);
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

        return send_text_message({ data, sender, chat: chatId, msg_type }).then(
            (response) => {
                dispatch({
                    type: SEND_MESSAGE_SUCCESS,
                    payload: {
                        newMessage: response.data.message,
                        messageInfo: response.data.messageInfo
                    }
                });

                dispatch({
                    type: SET_MESSAGE_READY,
                    payload: {
                        isReady: true
                    }
                });

                return Promise.resolve(response.data.message);
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