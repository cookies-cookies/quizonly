// Mock API for document management - uses localStorage to simulate backend
import type { DocumentInfo, DocumentResponse, DocumentListResponse, UploadResponse } from "./document";

const STORAGE_KEY = "quizonly_documents";
const USE_MOCK = true; // 设置为 false 时使用真实 API

// 从 localStorage 获取所有文档
function getStoredDocuments(): DocumentInfo[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // 初始化示例数据
    const initialData: DocumentInfo[] = [
      {
        id: "folder-1",
        name: "课程资料",
        type: "folder",
        parentId: null,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "folder-2",
        name: "作业提交",
        type: "folder",
        parentId: null,
        createdAt: "2024-01-10T14:20:00Z",
        updatedAt: "2024-01-10T14:20:00Z",
      },
      {
        id: "file-1",
        name: "数据结构与算法.pdf",
        type: "file",
        parentId: null,
        size: 5242880,
        fileType: "pdf",
        status: "completed",
        createdAt: "2024-01-20T09:15:00Z",
        updatedAt: "2024-01-20T09:15:00Z",
      },
      {
        id: "file-2",
        name: "机器学习笔记.docx",
        type: "file",
        parentId: null,
        size: 1048576,
        fileType: "docx",
        status: "completed",
        createdAt: "2024-01-18T16:45:00Z",
        updatedAt: "2024-01-18T16:45:00Z",
      },
      {
        id: "file-3",
        name: "实验数据.xlsx",
        type: "file",
        parentId: null,
        size: 2097152,
        fileType: "xlsx",
        status: "completed",
        createdAt: "2024-01-12T11:30:00Z",
        updatedAt: "2024-01-12T11:30:00Z",
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(stored);
}

// 保存文档到 localStorage
function saveDocuments(documents: DocumentInfo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

// 生成唯一 ID
function generateId(type: "file" | "folder"): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Mock: 获取文件/文件夹列表
export async function getDocuments(parentId?: string): Promise<DocumentListResponse> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const allDocs = getStoredDocuments();
    const filteredDocs = parentId
      ? allDocs.filter(doc => doc.parentId === parentId)
      : allDocs.filter(doc => doc.parentId === null);
    
    return { status: true, data: filteredDocs };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// Mock: 创建文件夹
export async function createFolder(name: string, parentId?: string): Promise<DocumentResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const documents = getStoredDocuments();
    const newFolder: DocumentInfo = {
      id: generateId("folder"),
      name,
      type: "folder",
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    documents.push(newFolder);
    saveDocuments(documents);
    
    return { status: true, data: newFolder };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// Mock: 上传文件
export async function uploadFile(file: File, parentId?: string): Promise<UploadResponse> {
  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const documents = getStoredDocuments();
    const fileId = generateId("file");
    const taskId = `task-${Date.now()}`;
    
    // 获取文件扩展名
    const fileName = file.name;
    const dotIndex = fileName.lastIndexOf(".");
    const fileType = dotIndex > 0 ? fileName.substring(dotIndex + 1) : "";
    
    const newFile: DocumentInfo = {
      id: fileId,
      name: fileName,
      type: "file",
      parentId: parentId || null,
      size: file.size,
      fileType,
      status: "completed",
      progress: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    documents.push(newFile);
    saveDocuments(documents);
    
    return { status: true, data: { fileId, taskId } };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// Mock: 删除文件/文件夹
export async function deleteDocument(id: string): Promise<DocumentResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const documents = getStoredDocuments();
    const docIndex = documents.findIndex(doc => doc.id === id);
    
    if (docIndex === -1) {
      return { status: false, error: "文档不存在" };
    }
    
    const deletedDoc = documents[docIndex];
    
    // 如果是文件夹，递归删除子项
    if (deletedDoc.type === "folder") {
      const deleteChildren = (parentId: string) => {
        const children = documents.filter(doc => doc.parentId === parentId);
        children.forEach(child => {
          if (child.type === "folder") {
            deleteChildren(child.id);
          }
          const childIndex = documents.findIndex(doc => doc.id === child.id);
          if (childIndex !== -1) {
            documents.splice(childIndex, 1);
          }
        });
      };
      deleteChildren(id);
    }
    
    documents.splice(docIndex, 1);
    saveDocuments(documents);
    
    return { status: true, data: deletedDoc };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// Mock: 重命名文件/文件夹
export async function renameDocument(id: string, name: string): Promise<DocumentResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const documents = getStoredDocuments();
    const doc = documents.find(d => d.id === id);
    
    if (!doc) {
      return { status: false, error: "文档不存在" };
    }
    
    doc.name = name;
    doc.updatedAt = new Date().toISOString();
    saveDocuments(documents);
    
    return { status: true, data: doc };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// Mock: 移动文件/文件夹
export async function moveDocument(id: string, targetParentId: string | null): Promise<DocumentResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const documents = getStoredDocuments();
    const doc = documents.find(d => d.id === id);
    
    if (!doc) {
      return { status: false, error: "文档不存在" };
    }
    
    // 检查是否移动到自己的子文件夹（避免循环）
    if (doc.type === "folder" && targetParentId) {
      let currentParent: string | null = targetParentId;
      while (currentParent) {
        if (currentParent === id) {
          return { status: false, error: "不能将文件夹移动到自己的子文件夹中" };
        }
        const parent = documents.find(d => d.id === currentParent);
        currentParent = parent?.parentId || null;
      }
    }
    
    doc.parentId = targetParentId;
    doc.updatedAt = new Date().toISOString();
    saveDocuments(documents);
    
    return { status: true, data: doc };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// Mock: 获取上传进度
export async function getUploadProgress(_taskId: string): Promise<{ status: boolean; progress?: number; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock: 直接返回 100% 完成
  return { status: true, progress: 100 };
}

// 导出是否使用 Mock
export { USE_MOCK };
