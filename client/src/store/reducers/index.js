import { combineReducers } from "redux";
import auth from "./authReducer"
import userData from "./userReducer";
import chatsData from "./chatReducer";
import messageData from "./messageReducer"
export default combineReducers({
  userData, auth, chatsData, messageData,
});