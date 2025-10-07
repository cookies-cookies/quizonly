import { useState, useEffect } from "react";
import { X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import "@/assets/components/rename-dialog.less";

interface RenameDialogProps {
  open: boolean;
  documentName: string;
  onClose: () => void;
  onConfirm: (newName: string) => void;
}

export default function RenameDialog({ open, documentName, onClose, onConfirm }: RenameDialogProps) {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNewName(documentName);
      setError("");
    }
  }, [open, documentName]);

  const handleConfirm = () => {
    const trimmedName = newName.trim();
    
    if (!trimmedName) {
      setError("名称不能为空");
      return;
    }

    if (trimmedName.length > 100) {
      setError("名称不能超过100个字符");
      return;
    }

    onConfirm(trimmedName);
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
    <div className="rename-dialog-overlay" onClick={onClose}>
      <div className="rename-dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="rename-dialog-header">
          <div className="rename-dialog-title">
            <Edit className="icon" />
            <span>重命名</span>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="rename-dialog-body">
          <div className="input-group">
            <label htmlFor="new-name">新名称</label>
            <Input
              id="new-name"
              type="text"
              placeholder="请输入新名称"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>

        <div className="rename-dialog-footer">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确定
          </Button>
        </div>
      </div>
    </div>
  );
}
