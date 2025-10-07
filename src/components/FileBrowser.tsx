import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Folder,
    File,
    FileText,
    FileSpreadsheet,
    FileImage,
    MoreVertical,
    Trash2,
    Edit,
    FolderOpen
} from "lucide-react";
import { selectCurrentFolderDocuments } from "@/store/document.ts";
import { setCurrentFolder, removeDocument, updateDocument } from "@/store/document.ts";
import { deleteDocument, renameDocument } from "@/api/document.ts";
import type { DocumentInfo } from "@/api/document.ts";
import RenameDialog from "./RenameDialog.tsx";
import DeleteDialog from "./DeleteDialog.tsx";
import "@/assets/components/file-browser.less";

export default function FileBrowser() {
    const documents = useSelector(selectCurrentFolderDocuments);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState<{
        docId: string;
        x: number;
        y: number;
    } | null>(null);
    const [renameDialog, setRenameDialog] = useState<{
        open: boolean;
        docId: string;
        docName: string;
    }>({ open: false, docId: "", docName: "" });
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        docId: string;
        docName: string;
        docType: "file" | "folder";
    }>({ open: false, docId: "", docName: "", docType: "file" });

    // 获取文件图标
    const getFileIcon = (doc: DocumentInfo) => {
        if (doc.type === "folder") {
            return <Folder className="file-icon folder-icon" />;
        }

        const ext = doc.fileType?.toLowerCase();
        switch (ext) {
            case "pdf":
            case "doc":
            case "docx":
                return <FileText className="file-icon document-icon" />;
            case "xls":
            case "xlsx":
                return <FileSpreadsheet className="file-icon spreadsheet-icon" />;
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return <FileImage className="file-icon image-icon" />;
            default:
                return <File className="file-icon" />;
        }
    };

    // 格式化文件大小
    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    };

    // 格式化日期
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "今天";
        if (days === 1) return "昨天";
        if (days < 7) return `${days} 天前`;
        return date.toLocaleDateString("zh-CN");
    };

    // 双击文件夹进入
    const handleDoubleClick = (doc: DocumentInfo) => {
        if (doc.type === "folder") {
            dispatch(setCurrentFolder(doc.id));
        } else {
            // 打开文件预览 - 根据文件类型导航到相应页面
            const ext = doc.fileType?.toLowerCase();
            if (ext === "pdf" || ext === "doc" || ext === "docx") {
                // 打开 PDF 查看器
                navigate(`/pdf/${doc.id}`);
            } else {
                console.log("打开文件:", doc.name);
            }
        }
    };

    // 右键菜单
    const handleContextMenu = (e: React.MouseEvent, docId: string) => {
        e.preventDefault();
        setContextMenu({
            docId,
            x: e.clientX,
            y: e.clientY,
        });
    };

    // 关闭右键菜单
    const closeContextMenu = () => {
        setContextMenu(null);
    };

    // 重命名
    const handleRename = (docId: string) => {
        const doc = documents.find(d => d.id === docId);
        if (doc) {
            setRenameDialog({ open: true, docId, docName: doc.name });
        }
        closeContextMenu();
    };

    // 确认重命名
    const handleRenameConfirm = async (newName: string) => {
        try {
            const response = await renameDocument(renameDialog.docId, newName);
            if (response.status && response.data) {
                dispatch(updateDocument(response.data));
                setRenameDialog({ open: false, docId: "", docName: "" });
            }
        } catch (error) {
            console.error("重命名失败:", error);
        }
    };

    // 删除
    const handleDelete = (docId: string) => {
        const doc = documents.find(d => d.id === docId);
        if (doc) {
            setDeleteDialog({
                open: true,
                docId,
                docName: doc.name,
                docType: doc.type
            });
        }
        closeContextMenu();
    };

    // 确认删除
    const handleDeleteConfirm = async () => {
        try {
            const response = await deleteDocument(deleteDialog.docId);
            if (response.status) {
                dispatch(removeDocument(deleteDialog.docId));
                setDeleteDialog({ open: false, docId: "", docName: "", docType: "file" });
            }
        } catch (error) {
            console.error("删除失败:", error);
        }
    };

    if (documents.length === 0) {
        return (
            <div className="file-browser-empty">
                <FolderOpen size={64} />
                <p>这里还没有文件</p>
                <span>点击上方的"上传课件"或"新建文件夹"开始使用</span>
            </div>
        );
    }

    return (
        <div className="file-browser" onClick={closeContextMenu}>
            <div className="file-grid">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="file-item"
                        onDoubleClick={() => handleDoubleClick(doc)}
                        onContextMenu={(e) => handleContextMenu(e, doc.id)}
                    >
                        <div className="file-item-icon">
                            {getFileIcon(doc)}
                            {doc.status && doc.status !== "completed" && (
                                <div className="file-status">
                                    {doc.status === "processing" && (
                                        <div className="processing-indicator">
                                            处理中 {doc.progress}%
                                        </div>
                                    )}
                                    {doc.status === "failed" && (
                                        <div className="failed-indicator">失败</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="file-item-info">
                            <div className="file-name" title={doc.name}>
                                {doc.name}
                            </div>
                            <div className="file-meta">
                                {doc.type === "file" && formatFileSize(doc.size)} · {formatDate(doc.updatedAt)}
                            </div>
                        </div>
                        <button
                            className="file-item-menu"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleContextMenu(e, doc.id);
                            }}
                        >
                            <MoreVertical size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* 右键菜单 */}
            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="context-menu-item"
                        onClick={() => handleRename(contextMenu.docId)}
                    >
                        <Edit size={14} />
                        <span>重命名</span>
                    </button>
                    <button
                        className="context-menu-item danger"
                        onClick={() => handleDelete(contextMenu.docId)}
                    >
                        <Trash2 size={14} />
                        <span>删除</span>
                    </button>
                </div>
            )}

            {/* 重命名对话框 */}
            <RenameDialog
                open={renameDialog.open}
                documentName={renameDialog.docName}
                onClose={() => setRenameDialog({ open: false, docId: "", docName: "" })}
                onConfirm={handleRenameConfirm}
            />

            {/* 删除确认对话框 */}
            <DeleteDialog
                open={deleteDialog.open}
                documentName={deleteDialog.docName}
                documentType={deleteDialog.docType}
                onClose={() => setDeleteDialog({ open: false, docId: "", docName: "", docType: "file" })}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
