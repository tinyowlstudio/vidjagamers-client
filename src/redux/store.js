import { configureStore } from "@reduxjs/toolkit"; 
import userReducer from "./reducers/user";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: "root",
    storage,
  };

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: { persistedReducer, user: userReducer }
});

export const persistor = persistStore(store); 