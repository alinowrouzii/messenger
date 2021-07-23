import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_LOGIN_REG_MESSAGE
} from "../actions/types";

const initialState = { isLoggedIn: false, loginRegMessage: "", user: null };

export default (state = initialState, action) => {
    const { type, payload } = action;

    console.log(type, payload);

    switch (type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload.user,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        case SET_LOGIN_REG_MESSAGE:
            return {
                ...state,
                loginRegMessage: payload.message,
            };
        default:
            return state;
    }
}