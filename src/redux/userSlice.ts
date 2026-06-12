import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface UserState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  string, //返回值类型，jwt
  { username: string; password: string } //credentials 类型
>("user/login", async (credentials) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("登录失败");
  }
  const data = await response.json();
  if (!data.token) {
    throw new Error("登录失败");
  }
  return data.token;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      return { ...initialState, token: null };
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  }, //只能处理同步操作

  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.token = action.payload;

      state.error = null;
      localStorage.setItem("token", action.payload); //保存 token 到 localstorage
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "登录失败";
    });
  }, //处理异步操作
});

export const { logout, setToken } = userSlice.actions;
export default userSlice.reducer;
