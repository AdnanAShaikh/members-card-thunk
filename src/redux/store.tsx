import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postSlice";

export const store = configureStore({
  reducer: { posts: postReducer },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
