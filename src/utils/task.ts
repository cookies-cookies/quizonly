/**
 * 任务管理工具函数
 * 提供便捷的任务操作方法
 */

import { AppDispatch } from "@/store/index.ts";
import {
    addTask,
    updateTaskStatus,
    updateTaskProgress,
    removeTask,
    TaskItem,
    TaskStatus,
} from "@/store/task.ts";

/**
 * 添加新任务（自动生成ID和时间戳）
 */
export function addNewTask(
    dispatch: AppDispatch,
    fileName: string,
    status: TaskStatus = "processing"
): string {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const task: TaskItem = {
        id,
        fileName,
        status,
        createdAt: new Date().toISOString(),
        progress: status === "processing" ? 0 : undefined,
    };

    dispatch(addTask(task));
    return id;
}

/**
 * 模拟文件上传并创建任务
 */
export async function simulateFileUpload(
    dispatch: AppDispatch,
    file: File
): Promise<string> {
    // 创建任务
    const taskId = addNewTask(dispatch, file.name, "processing");

    // 模拟上传进度
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            dispatch(updateTaskStatus({ id: taskId, status: "completed" }));
        } else {
            dispatch(updateTaskProgress({ id: taskId, progress: Math.floor(progress) }));
        }
    }, 500);

    return taskId;
}

/**
 * 批量删除已完成的任务
 */
export function clearCompletedTasks(
    dispatch: AppDispatch,
    tasks: TaskItem[]
): number {
    const completedTasks = tasks.filter((t) => t.status === "completed");
    completedTasks.forEach((task) => {
        dispatch(removeTask(task.id));
    });
    return completedTasks.length;
}

/**
 * 批量删除失败的任务
 */
export function clearFailedTasks(
    dispatch: AppDispatch,
    tasks: TaskItem[]
): number {
    const failedTasks = tasks.filter((t) => t.status === "failed");
    failedTasks.forEach((task) => {
        dispatch(removeTask(task.id));
    });
    return failedTasks.length;
}

/**
 * 重试失败的任务
 */
export function retryFailedTask(dispatch: AppDispatch, taskId: string): void {
    dispatch(
        updateTaskStatus({
            id: taskId,
            status: "processing",
        })
    );
    dispatch(updateTaskProgress({ id: taskId, progress: 0 }));
}
