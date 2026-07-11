import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CultureCode } from "./i18nReducer";

export interface I18nState {
  currentLanguage: CultureCode;
}

const initialState: I18nState = {
  currentLanguage: "zh-CN",
};

export const i18nSlice = createSlice({
  name: "i18n",
  initialState,
  reducers: {
    setCulture(state, action: PayloadAction<CultureCode>) {
      //注意这里，我们直接改 state，看起来像可变
      //其实底层用 immer 保证不可变
      state.currentLanguage = action.payload;
    },
  },
});


export default i18nSlice.reducer;
