import { configureStore } from "@reduxjs/toolkit";
import { i18nSlice } from "./i18nSlice";
import searchReducer from "./searchSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    i18n: i18nSlice.reducer, //命名空间 i18n
    search: searchReducer, //命名空间 search,state.search
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export default store;
