import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index.ts";
import { setTaskList, getTaskList } from "@/conf/storage.ts";

// 任务状态类型
export type TaskStatus = "processing" | "completed" | "failed";

// 任务项类型
export interface TaskItem {
    id: string;
    fileName: string;
    status: TaskStatus;
    createdAt?: string;
    updatedAt?: string;
    progress?: number; // 处理进度 0-100
    error?: string; // 错误信息
}

interface TaskState {
    tasks: TaskItem[];
}

// 从 localStorage 加载初始任务列表
const initialState: TaskState = {
    tasks: getTaskList(),
};

export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        // 添加新任务
        addTask: (state, action: PayloadAction<TaskItem>) => {
            state.tasks.push(action.payload);
            setTaskList(state.tasks); // 同步到 localStorage
        },

        // 批量添加任务
        addTasks: (state, action: PayloadAction<TaskItem[]>) => {
            state.tasks.push(...action.payload);
            setTaskList(state.tasks); // 同步到 localStorage
        },

        // 更新任务状态
        updateTaskStatus: (
            state,
            action: PayloadAction<{ id: string; status: TaskStatus }>
        ) => {
            const task = state.tasks.find((t) => t.id === action.payload.id);
            if (task) {
                task.status = action.payload.status;
                task.updatedAt = new Date().toISOString();
                setTaskList(state.tasks); // 同步到 localStorage
            }
        },

        // 更新任务进度
        updateTaskProgress: (
            state,
            action: PayloadAction<{ id: string; progress: number }>
        ) => {
            const task = state.tasks.find((t) => t.id === action.payload.id);
            if (task) {
                task.progress = action.payload.progress;
                task.updatedAt = new Date().toISOString();
                setTaskList(state.tasks); // 同步到 localStorage
            }
        },

        // 更新整个任务
        updateTask: (state, action: PayloadAction<TaskItem>) => {
            const index = state.tasks.findIndex((t) => t.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = {
                    ...action.payload,
                    updatedAt: new Date().toISOString(),
                };
                setTaskList(state.tasks); // 同步到 localStorage
            }
        },

        // 删除任务
        removeTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter((t) => t.id !== action.payload);
            setTaskList(state.tasks); // 同步到 localStorage
        },

        // 清空所有任务
        clearTasks: (state) => {
            state.tasks = [];
            setTaskList([]); // 同步到 localStorage
        },

        // 设置任务列表（从API或localStorage获取）
        setTasks: (state, action: PayloadAction<TaskItem[]>) => {
            state.tasks = action.payload;
            setTaskList(state.tasks); // 同步到 localStorage
        },

        // 设置任务错误
        setTaskError: (
            state,
            action: PayloadAction<{ id: string; error: string }>
        ) => {
            const task = state.tasks.find((t) => t.id === action.payload.id);
            if (task) {
                task.error = action.payload.error;
                task.status = "failed";
                task.updatedAt = new Date().toISOString();
                setTaskList(state.tasks); // 同步到 localStorage
            }
        },
    },
});

export const {
    addTask,
    addTasks,
    updateTaskStatus,
    updateTaskProgress,
    updateTask,
    removeTask,
    clearTasks,
    setTasks,
    setTaskError,
} = taskSlice.actions;

// Selectors
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectTaskById = (state: RootState, id: string) =>
    state.task.tasks.find((t) => t.id === id);
export const selectTasksByStatus = (state: RootState, status: TaskStatus) =>
    state.task.tasks.filter((t) => t.status === status);
export const selectProcessingTasks = (state: RootState) =>
    state.task.tasks.filter((t) => t.status === "processing");
export const selectCompletedTasks = (state: RootState) =>
    state.task.tasks.filter((t) => t.status === "completed");
export const selectFailedTasks = (state: RootState) =>
    state.task.tasks.filter((t) => t.status === "failed");

export default taskSlice.reducer;
