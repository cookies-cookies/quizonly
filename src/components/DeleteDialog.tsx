import { X, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import "@/assets/components/delete-dialog.less";

interface DeleteDialogProps {
  open: boolean;
  documentName: string;
  documentType: "file" | "folder";
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteDialog({ open, documentName, documentType, onClose, onConfirm }: DeleteDialogProps) {
  if (!open) return null;

  const isFolder = documentType === "folder";

  return (
    <div className="delete-dialog-overlay" onClick={onClose}>
      <div className="delete-dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-dialog-header">
          <div className="delete-dialog-title">
            <Trash2 className="icon" />
            <span>确认删除</span>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="delete-dialog-body">
          <div className="warning-box">
            <AlertTriangle className="warning-icon" />
            <div className="warning-content">
              <p className="warning-title">
                {isFolder ? "删除文件夹" : "删除文件"}
              </p>
              <p className="warning-message">
                {isFolder 
                  ? `确定要删除文件夹"${documentName}"吗？文件夹内的所有内容也将被删除。`
                  : `确定要删除文件"${documentName}"吗？`
                }
              </p>
              <p className="warning-note">此操作无法撤销！</p>
            </div>
          </div>
        </div>

        <div className="delete-dialog-footer">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            删除
          </Button>
        </div>
      </div>
    </div>
  );
}
