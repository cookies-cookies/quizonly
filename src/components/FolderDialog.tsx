import { useState, useEffect } from "react";
import { X, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import "@/assets/components/folder-dialog.less";

interface FolderDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (folderName: string) => void;
}

export default function FolderDialog({ open, onClose, onConfirm }: FolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFolderName("");
      setError("");
    }
  }, [open]);

  const handleConfirm = () => {
    const trimmedName = folderName.trim();
    
    if (!trimmedName) {
      setError("文件夹名称不能为空");
      return;
    }

    if (trimmedName.length > 50) {
      setError("文件夹名称不能超过50个字符");
      return;
    }

    // 检查非法字符
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(trimmedName)) {
      setError("文件夹名称不能包含特殊字符: < > : \" / \\ | ? *");
      return;
    }

    onConfirm(trimmedName);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="folder-dialog-overlay" onClick={onClose}>
      <div className="folder-dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="folder-dialog-header">
          <div className="folder-dialog-title">
            <FolderPlus className="icon" />
            <span>新建文件夹</span>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="folder-dialog-body">
          <div className="input-group">
            <label htmlFor="folder-name">文件夹名称</label>
            <Input
              id="folder-name"
              type="text"
              placeholder="请输入文件夹名称"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>

        <div className="folder-dialog-footer">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            创建
          </Button>
        </div>
      </div>
    </div>
  );
}
