import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import rootReducer from "./reducers";


const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];


export default () => {
  let store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(...middleware))
  );
  let persistor = persistStore(store)
  return { store, persistor }
}