import { combineReducers } from "redux";
import auth from "./authReducer"
import userData from "./userReducer";
import chatsData from "./chatReducer";

export default combineReducers({
  userData, auth, chatsData,
});