
import FormData from "form-data";

import { sendTextMessage as send_text_message, sendAudioMessage as send_audio_message, getMessages as get_messages } from './../../api/message.js'
import {
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAIL,
    SET_MESSAGE_READY,
    SEND_MESSAGE
} from "./types";

export const sendMessage = (newMsg) => (dispatch) => {

    if (newMsg.kind === 'AUDIO_MESSAGE') {

        const form = new FormData();

        const { data, ...msg } = newMsg;

        form.append('voice', data);
        form.append('text', msg.text.length === 0 ? ' ' : msg.text);

        const url = URL.createObjectURL(data);
        dispatch({
            type: SEND_MESSAGE,
            payload: {
                newMessage: { url, ...msg }
            }
        });

        return send_audio_message({ form, ...msg }).then(
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
                newMessage: newMsg
            }
        });

        return send_text_message(newMsg).then(
            (response) => {
                dispatch({
                    type: SEND_MESSAGE_SUCCESS,
                    payload: {
                        messageId: newMsg._id,
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
