import { fetchMe, fetchUserData, fetchContactUsers } from './../api/user.js'
import {
  FETCH_ME_SUCCESS,
  FETCH_ME_FAIL,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
  SET_OWN_USER_READY,
  FETCH_CONTACT_USERS_SUCCESS,
  FETCH_CONTACT_USERS_FAIL,
} from "./types";

export const getMe = () => (dispatch) => {
  return fetchMe().then(
    (response) => {
      console.log(response.data)
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
        type: FETCH_ME_FAIL,
        payload: { message, }
      });

      return Promise.reject();
    }
  );
};


export const getUserData = (userId) => (dispatch) => {
  return fetchUserData(userId).then(
    (response) => {
      console.log(response.data)
      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: {
          user: response.data.user,
          message: ""
        },
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
        type: FETCH_USER_FAIL,
        payload: { message, }
      });

      return Promise.reject();
    }
  );
};
