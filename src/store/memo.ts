import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index.ts";
import type { MemoInfo } from "@/api/memo.ts";

interface MemoState {
  memos: MemoInfo[];
  loading: boolean;
}

const initialState: MemoState = {
  memos: [],
  loading: false,
};

export const memoSlice = createSlice({
  name: "memo",
  initialState,
  reducers: {
    setMemos: (state, action: PayloadAction<MemoInfo[]>) => {
      state.memos = action.payload;
    },
    addMemo: (state, action: PayloadAction<MemoInfo>) => {
      state.memos.push(action.payload);
    },
    removeMemo: (state, action: PayloadAction<string>) => {
      state.memos = state.memos.filter(memo => memo.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// Selectors
export const selectMemos = (state: RootState) => state.memo.memos;
export const selectMemoLoading = (state: RootState) => state.memo.loading;

export const {
  setMemos,
  addMemo,
  removeMemo,
  setLoading,
} = memoSlice.actions;

export default memoSlice.reducer;
