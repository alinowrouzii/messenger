import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import { signup as reg, login as log_in, logout as log_out } from './../api/auth.js'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    FETCH_ME_SUCCESS,
    SET_OWN_USER_READY
} from "./types";

export const signup = (name, username, password) => (dispatch) => {
    return reg({ name, username, password }).then(
        (response) => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: { message: response.data.message },
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
                type: REGISTER_FAIL,
                payload: { message, }

            });

            return Promise.reject();
        }
    );
};

export const login = (username, password) => (dispatch) => {
    return log_in({ username, password }).then(
        (response) => {
            console.log(response.data)
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    message: ""
                },
            });

            dispatch({
                type: FETCH_ME_SUCCESS,
                payload: {
                    user: response.data.user,
                    message: ""
                },
            });

            dispatch({
                type: SET_OWN_USER_READY
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
                type: LOGIN_FAIL,
                payload: { message, }
            });

            return Promise.reject();
        }
    );
};



export const logout = () => (dispatch) => {

    storage.removeItem('persist:root');
    dispatch({
        type: LOGOUT,
    });

    return log_out()
        .then(
            (response) => {
                return Promise.resolve();
            },
            (error) => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                // dispatch({
                //   type: SET_MESSAGE,
                //   payload: { message, },
                // });
                return Promise.reject();
            }
        );
};
