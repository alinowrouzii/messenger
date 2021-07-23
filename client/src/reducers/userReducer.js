import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
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
                loginRegMessage: payload.message
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                loginRegMessage: payload.message
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload.user,
                loginRegMessage: payload.message
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                loginRegMessage: payload.message
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                loginRegMessage: ""
            };
        default:
            return state;
    }
}