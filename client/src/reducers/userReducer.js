import {
    FETCH_ME_SUCCESS,
    FETCH_ME_FAIL,
    SET_OWN_USER_READY,
    LOGOUT
} from "../actions/types";

const initialState = { ownUser: null, ownUserMessage:"", ownUserIsReady:false };

export default (state = initialState, action) => {
    const { type, payload } = action;
    console.log(type, payload);
    
    switch (type) {
        case FETCH_ME_SUCCESS:
            return {
                ...state,
                ownUser: payload.user,
                ownUserMessage: payload.message
            };
        case FETCH_ME_FAIL:
            return {
                ...state,
                ownUserMessage: payload.message
            };
        case SET_OWN_USER_READY:
            return {
                ...state,
                ownUserIsReady: true
            };
        // case FETCH_CONTACT_USERS_SUCCESS:
        //     return {
        //         ...state,
        //         ownUserMessage: payload.message
        //     };
        // case FETCH_CONTACT_USERS_FAIL:
        //     return {
        //         ...state,
        //         ownUserMessage: payload.message
        //     };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}