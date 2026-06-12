import { createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "../types/custom";
import { createSlice } from "@reduxjs/toolkit";
import { getApiUrl } from "@/utils/url";

export const fetchSearchResults = createAsyncThunk<
  Product[],
  { keyword: string }
>("search", async ({ keyword }: { keyword: string }, { signal }) => {
  const controller = new AbortController();
  signal.addEventListener("abort", () => {
    controller.abort();
  });

  // 修改这里：使用 getApiUrl 而不是直接使用 VITE_API_BASE
  const apiUrl = getApiUrl(
    `/api/search?keyword=${encodeURIComponent(keyword)}`,
  );

  console.log("搜索请求URL:", apiUrl); // 调试用

  const response = await fetch(apiUrl, { signal: controller.signal });

  if (response.status == 404) {
    throw new Error("没有找到商品");
  }
  if (!response.ok) {
    throw new Error("请求失败");
  }
  const data: Product[] = await response.json();
  return data;
});

export interface SearchState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  items: [],
  isLoading: false,
  error: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.items = [];
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        if (action.error.message === "Aborted") {
          console.log("请求已取消");
          state.error = "请求已取消";
        } else {
          state.error = action.error.message || "请求失败";
        }
        state.isLoading = false;
        state.items = [];
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
