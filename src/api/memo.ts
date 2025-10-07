import axios from "axios";
import * as mockAPI from "./memo.mock";

// 是否使用 Mock API
const USE_MOCK = true;

// 导出类型
export type { MemoInfo, MemoResponse, MemoListResponse } from "./memo.mock";

// 获取所有备忘录
export async function getMemos() {
  if (USE_MOCK) return mockAPI.getMemos();
  
  try {
    const resp = await axios.get("/api/memos");
    return resp.data;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// 创建备忘录（AI 生成）
export async function createMemo(fileId: string, fileName: string) {
  if (USE_MOCK) return mockAPI.createMemo(fileId, fileName);
  
  try {
    const resp = await axios.post("/api/memos", { fileId, fileName });
    return resp.data;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// 获取单个备忘录
export async function getMemo(id: string) {
  if (USE_MOCK) return mockAPI.getMemo(id);
  
  try {
    const resp = await axios.get(`/api/memos/${id}`);
    return resp.data;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// 删除备忘录
export async function deleteMemo(id: string) {
  if (USE_MOCK) return mockAPI.deleteMemo(id);
  
  try {
    const resp = await axios.delete(`/api/memos/${id}`);
    return resp.data;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}
