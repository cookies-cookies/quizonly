import axios from "axios";
import * as mockAPI from "./document.mock";

// 是否使用 Mock API（开发模式下使用 mock，生产环境改为 false）
const USE_MOCK = true;

// 文件/文件夹类型
export type DocumentType = "file" | "folder";

// 文件信息
export interface DocumentInfo {
  id: string;
  name: string;
  type: DocumentType;
  parentId: string | null;
  size?: number;
  fileType?: string;
  status?: "processing" | "completed" | "failed";
  progress?: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

// API 响应类型
export interface DocumentResponse {
  status: boolean;
  data?: DocumentInfo;
  error?: string;
}

export interface DocumentListResponse {
  status: boolean;
  data?: DocumentInfo[];
  error?: string;
}

export interface UploadResponse {
  status: boolean;
  data?: {
    fileId: string;
    taskId: string;
  };
  error?: string;
}

// 获取文件/文件夹列表
export async function getDocuments(parentId?: string): Promise<DocumentListResponse> {
  if (USE_MOCK) return mockAPI.getDocuments(parentId);
  
  try {
    const params = parentId ? { parentId } : {};
    const resp = await axios.get("/api/documents", { params });
    return resp.data as DocumentListResponse;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// 创建文件夹
export async function createFolder(name: string, parentId?: string): Promise<DocumentResponse> {
  if (USE_MOCK) return mockAPI.createFolder(name, parentId);
  
  try {
    const resp = await axios.post("/api/folders", { name, parentId });
    return resp.data as DocumentResponse;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// 上传文件
export async function uploadFile(file: File, parentId?: string): Promise<UploadResponse> {
  if (USE_MOCK) return mockAPI.uploadFile(file, parentId);
  
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (parentId) {
      formData.append("parentId", parentId);
    }

    const resp = await axios.post("/api/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    return resp.data as UploadResponse;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// 删除文件/文件夹
export async function deleteDocument(id: string): Promise<DocumentResponse> {
  if (USE_MOCK) return mockAPI.deleteDocument(id);
  
  try {
    const resp = await axios.delete(`/api/documents/${id}`);
    return resp.data as DocumentResponse;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// 重命名文件/文件夹
export async function renameDocument(id: string, name: string): Promise<DocumentResponse> {
  if (USE_MOCK) return mockAPI.renameDocument(id, name);
  
  try {
    const resp = await axios.patch(`/api/documents/${id}`, { name });
    return resp.data as DocumentResponse;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// 移动文件/文件夹
export async function moveDocument(id: string, targetParentId: string | null): Promise<DocumentResponse> {
  if (USE_MOCK) return mockAPI.moveDocument(id, targetParentId);
  
  try {
    const resp = await axios.patch(`/api/documents/${id}/move`, { targetParentId });
    return resp.data as DocumentResponse;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// 获取文件上传进度
export async function getUploadProgress(taskId: string): Promise<{ status: boolean; progress?: number; error?: string }> {
  if (USE_MOCK) return mockAPI.getUploadProgress(taskId);
  
  try {
    const resp = await axios.get(`/api/documents/upload/${taskId}/progress`);
    return resp.data;
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}
