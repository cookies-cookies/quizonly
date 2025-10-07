import axios from "axios";
import type { TaskItem } from "@/store/task.ts";

// API 响应类型
export type TaskListResponse = {
    status: boolean;
    data: TaskItem[];
    error?: string;
};

export type TaskResponse = {
    status: boolean;
    data: TaskItem;
    error?: string;
};

/**
 * 获取任务列表
 */
export async function fetchTasks(): Promise<TaskListResponse> {
    try {
        const resp = await axios.get("/api/tasks");
        return resp.data;
    } catch (e) {
        return { status: false, data: [], error: (e as Error).message };
    }
}

/**
 * 创建新任务
 */
export async function createTask(
    fileName: string,
    file?: File
): Promise<TaskResponse> {
    try {
        const formData = new FormData();
        formData.append("fileName", fileName);
        if (file) {
            formData.append("file", file);
        }

        const resp = await axios.post("/api/tasks", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return resp.data;
    } catch (e) {
        return {
            status: false,
            data: { id: "", fileName: "", status: "failed" },
            error: (e as Error).message,
        };
    }
}

/**
 * 更新任务状态
 */
export async function updateTaskStatusAPI(
    id: string,
    status: "processing" | "completed" | "failed"
): Promise<TaskResponse> {
    try {
        const resp = await axios.patch(`/api/tasks/${id}`, { status });
        return resp.data;
    } catch (e) {
        return {
            status: false,
            data: { id, fileName: "", status: "failed" },
            error: (e as Error).message,
        };
    }
}

/**
 * 删除任务
 */
export async function deleteTask(id: string): Promise<{ status: boolean }> {
    try {
        const resp = await axios.delete(`/api/tasks/${id}`);
        return resp.data;
    } catch (e) {
        return { status: false };
    }
}

/**
 * 获取任务详情
 */
export async function getTaskById(id: string): Promise<TaskResponse> {
    try {
        const resp = await axios.get(`/api/tasks/${id}`);
        return resp.data;
    } catch (e) {
        return {
            status: false,
            data: { id, fileName: "", status: "failed" },
            error: (e as Error).message,
        };
    }
}

/**
 * WebSocket 连接用于实时任务更新
 */
export function createTaskWebSocket(
    onMessage: (task: TaskItem) => void,
    onError?: (error: Event) => void
): WebSocket {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/tasks`);

    ws.onmessage = (event) => {
        try {
            const task = JSON.parse(event.data) as TaskItem;
            onMessage(task);
        } catch (e) {
            console.error("Failed to parse WebSocket message:", e);
        }
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (onError) onError(error);
    };

    return ws;
}
