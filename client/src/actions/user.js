import { signup as reg, login as log_in } from './../api/user.js'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SET_MESSAGE,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "./types";

export const signup = (name, username, password) => (dispatch) => {
  return reg({ name, username, password }).then(
    (response) => {
      dispatch({
        type: REGISTER_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
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
      });

      dispatch({
        type: SET_MESSAGE,
        payload: { message, },
      });

      return Promise.reject();
    }
  );
};



export const login = (username, password) => (dispatch) => {
  return log_in({ username, password }).then(
    (data) => {
      console.log(data.data)
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data.data.user },
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
      });

      dispatch({
        type: SET_MESSAGE,
        payload: { message, }
      });

      return Promise.reject();
    }
  );
};