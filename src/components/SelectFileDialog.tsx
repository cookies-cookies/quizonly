import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { X, FileText, File, Folder, Search } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { selectFiles } from "@/store/document.ts";
import type { DocumentInfo } from "@/api/document.ts";
import "@/assets/components/select-file-dialog.less";

interface SelectFileDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (files: DocumentInfo[]) => void;
}

export default function SelectFileDialog({ open, onClose, onConfirm }: SelectFileDialogProps) {
    const files = useSelector(selectFiles);
    const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // 过滤文件
    const filteredFiles = useMemo(() => {
        if (!searchQuery.trim()) return files;
        const query = searchQuery.toLowerCase();
        return files.filter(file =>
            file.name.toLowerCase().includes(query)
        );
    }, [files, searchQuery]);

    const selectedFiles = files.filter(f => selectedFileIds.includes(f.id));

    const handleToggleFile = (fileId: string) => {
        setSelectedFileIds(prev => 
            prev.includes(fileId) 
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    const handleConfirm = () => {
        if (selectedFiles.length > 0) {
            onConfirm(selectedFiles);
            setSelectedFileIds([]);
            setSearchQuery("");
        }
    };

    const getFileIcon = (file: DocumentInfo) => {
        const ext = file.fileType?.toLowerCase();
        if (ext === "pdf" || ext === "doc" || ext === "docx") {
            return <FileText className="file-icon-type document" />;
        }
        return <File className="file-icon-type" />;
    };

    if (!open) return null;

    return (
        <div className="select-file-dialog-overlay" onClick={onClose}>
            <div className="select-file-dialog-content" onClick={(e) => e.stopPropagation()}>
                <div className="select-file-dialog-header">
                    <div className="select-file-dialog-title">
                        <Folder className="icon" />
                        <span>选择对创建备忘录</span>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="search-section">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="搜索文件名"
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchQuery("")}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="select-file-dialog-body">
                    {files.length === 0 ? (
                        <div className="empty-state">
                            <FileText size={48} />
                            <p>还没有文件</p>
                            <span>请先上传文件</span>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="empty-state">
                            <Search size={48} />
                            <p>未找到匹配的文件</p>
                            <span>尝试其他关键词</span>
                        </div>
                    ) : (
                        <div className="file-list">
                            {filteredFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className={`file-item ${selectedFileIds.includes(file.id) ? "selected" : ""}`}
                                    onClick={() => handleToggleFile(file.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedFileIds.includes(file.id)}
                                        onChange={() => handleToggleFile(file.id)}
                                        className="file-checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="file-content">
                                        {getFileIcon(file)}
                                        <div className="file-info">
                                            <div className="file-name">{file.name}</div>
                                            <div className="file-meta">
                                                {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="select-file-dialog-footer">
                    <div className="footer-info">
                        <span className="quota-info">当前额度: {selectedFiles.length}/∞</span>
                    </div>
                    <div className="footer-actions">
                        <Button variant="outline" onClick={onClose}>
                            取消
                        </Button>
                        <Button onClick={handleConfirm} disabled={selectedFiles.length === 0}>
                            确认选择
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
