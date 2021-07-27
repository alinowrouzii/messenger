import {
    FETCH_ME_SUCCESS,
    FETCH_ME_FAIL,
    SET_OWN_USER_READY,
    SEARCH_USER_SUCCESS,
    SEARCH_USER_FAIL,
    LOGOUT
} from "../actions/types";

const initialState = { ownUser: null, ownUserMessage: "", ownUserIsReady: false, searchedUsers: [] };

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
        case SEARCH_USER_SUCCESS:
            return {
                ...state,
                searchedUsers: payload.searchedUsers,
                ownUserMessage: payload.message
            }
        case SEARCH_USER_FAIL:
            return {
                ...state,
                ownUserMessage: payload.message
            }
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