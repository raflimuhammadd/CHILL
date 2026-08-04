import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import watchHistoryReducer from "./slices/watchHistorySlice"

const store = configureStore({
    reducer: {
       users: usersReducer,
       watchHistory: watchHistoryReducer,   
    },
});

export default store;