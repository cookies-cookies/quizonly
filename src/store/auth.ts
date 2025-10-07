import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenField } from "@/conf/bootstrap.ts";
import { AppDispatch, RootState } from "./index.ts";
import { forgetMemory, setMemory } from "@/utils/memory.ts";
import { doState } from "@/api/auth.ts";

// 会员等级类型
export type MembershipLevel = "trial" | "monthly" | "semester" | "yearly" | null;

// 会员订阅信息
export interface MembershipSubscription {
  level: MembershipLevel;    // 会员等级: trial(体验), monthly(月), semester(学期), yearly(年)
  levelName: string;         // 等级名称，如 "月会员"
  subscribeTime: string;     // 订阅时间
  expireTime: string;        // 到期时间
  amount: number;            // 支付金额
  autoRenew: boolean;        // 是否自动续费
}

// 使用记录（额度使用历史）
export interface UsageRecord {
  type: string;              // 类型，如 "对话", "文件解析", "图片生成"
  modelName: string;         // 使用的模型
  operationTime: string;     // 操作时间
  amount: number;            // 使用量
  unit: string;              // 单位
  remaining: number;         // 剩余额度
  total: number;             // 总额度
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
    init: false,
    authenticated: false,
    admin: false,
    username: "",
    userId: "",
    membershipLevel: null as MembershipLevel,        // 当前会员等级
    isVip: false,                                     // VIP状态（有未到期的订阅即为VIP）
    subscription: null as MembershipSubscription | null,  // 当前会员订阅信息
    usageRecords: [] as UsageRecord[],                // 使用记录
    tasks: [] as number[],
  },
  reducers: {
    setToken: (state, action) => {
      const token = (action.payload as string).trim();
      state.token = token;
      axios.defaults.headers.common["Authorization"] = token;
      if (token.length > 0) setMemory(tokenField, token);
    },
    setAuthenticated: (state, action) => {
      state.authenticated = action.payload as boolean;
    },
    setUsername: (state, action) => {
      state.username = action.payload as string;
    },
    setInit: (state, action) => {
      state.init = action.payload as boolean;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload as boolean;
    },
    updateData: (state, action) => {
      state.init = true;
      state.authenticated = action.payload.authenticated as boolean;
      state.username = action.payload.username as string;
      state.admin = action.payload.admin as boolean;
      if (action.payload.userId !== undefined) {
        state.userId = action.payload.userId as string;
      }
      if (action.payload.isVip !== undefined) {
        state.isVip = action.payload.isVip as boolean;
      }
      if (action.payload.membershipLevel !== undefined) {
        state.membershipLevel = action.payload.membershipLevel as MembershipLevel;
      }
      if (action.payload.subscription !== undefined) {
        state.subscription = action.payload.subscription as MembershipSubscription | null;
      }
      if (action.payload.usageRecords !== undefined) {
        state.usageRecords = action.payload.usageRecords as UsageRecord[];
      }
    },
    increaseTask: (state, action) => {
      state.tasks.push(action.payload as number);
    },
    decreaseTask: (state, action) => {
      state.tasks = state.tasks.filter((v) => v !== (action.payload as number));
    },
    clearTask: (state) => {
      state.tasks = [];
    },
    logout: (state) => {
      state.token = "";
      state.authenticated = false;
      state.username = "";
      state.userId = "";
      state.isVip = false;
      state.membershipLevel = null;
      state.subscription = null;
      state.usageRecords = [];
      axios.defaults.headers.common["Authorization"] = "";
      forgetMemory(tokenField);

      location.reload();
    },
  },
});

export function validateToken(
  dispatch: AppDispatch,
  token: string,
  hook?: () => any,
) {
  token = token.trim();
  dispatch(setToken(token));

  if (token.length === 0) {
    dispatch(
      updateData({
        authenticated: false,
        username: "",
        admin: false,
      }),
    );

    return;
  } else
    doState()
      .then((data) => {
        dispatch(
          updateData({
            authenticated: data.status,
            username: data.user,
            admin: data.admin,
          }),
        );

        hook && hook();
      })
      .catch((err) => {
        // keep state
        console.debug(err);
      });
}

export const selectAuthenticated = (state: RootState) =>
  state.auth.authenticated;
export const selectUsername = (state: RootState) => state.auth.username;
export const selectUserId = (state: RootState) => state.auth.userId;
export const selectIsVip = (state: RootState) => state.auth.isVip;
export const selectMembershipLevel = (state: RootState) => state.auth.membershipLevel;
export const selectSubscription = (state: RootState) => state.auth.subscription;
export const selectUsageRecords = (state: RootState) => state.auth.usageRecords;
export const selectInit = (state: RootState) => state.auth.init;
export const selectAdmin = (state: RootState) => state.auth.admin;
export const selectTasks = (state: RootState) => state.auth.tasks;
export const selectTasksLength = (state: RootState) => state.auth.tasks.length;
export const selectIsTasking = (state: RootState) =>
  state.auth.tasks.length > 0;

export const {
  setToken,
  setAuthenticated,
  setUsername,
  logout,
  setInit,
  setAdmin,
  updateData,
  increaseTask,
  decreaseTask,
  clearTask,
} = authSlice.actions;
export default authSlice.reducer;
