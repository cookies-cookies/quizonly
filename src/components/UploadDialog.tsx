import { useState, useRef, DragEvent } from "react";
import { X, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import "@/assets/components/upload-dialog.less";

interface UploadDialogProps {
    open: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => void;
}

function UploadDialog({ open, onClose, onUpload }: UploadDialogProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!open) return null;

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        if (selectedFiles.length > 0) {
            onUpload(selectedFiles);
            setSelectedFiles([]);
            onClose();
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="upload-dialog-overlay" onClick={onClose}>
            <div className="upload-dialog" onClick={(e) => e.stopPropagation()}>
                {/* 头部 */}
                <div className="upload-dialog-header">
                    <h3 className="upload-dialog-title">上传文件</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="upload-dialog-close"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* 上传区域 */}
                <div className="upload-dialog-content">
                    <div
                        className={`upload-drop-zone ${isDragging ? "dragging" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClickUpload}
                    >
                        <Upload className="upload-icon" />
                        <p className="upload-text">点击或拖拽文件到此区域</p>
                        <p className="upload-hint">支持 PDF, DOC, DOCX, PPT, PPTX 等格式</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                        />
                    </div>

                    {/* 已选文件列表 */}
                    {selectedFiles.length > 0 && (
                        <div className="selected-files">
                            <h4 className="selected-files-title">已选择文件</h4>
                            <div className="file-list">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <FileText className="file-icon" />
                                        <div className="file-info">
                                            <div className="file-name">{file.name}</div>
                                            <div className="file-size">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveFile(index)}
                                            className="file-remove"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 底部按钮 */}
                <div className="upload-dialog-footer">
                    <Button variant="outline" onClick={onClose}>
                        取消
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={selectedFiles.length === 0}
                    >
                        开始上传 ({selectedFiles.length})
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default UploadDialog;
