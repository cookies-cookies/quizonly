import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    Trash2,
    Eye,
    Calendar,
    File
} from "lucide-react";
import { selectMemos } from "@/store/memo.ts";
import { removeMemo } from "@/store/memo.ts";
import { deleteMemo } from "@/api/memo.ts";
import "@/assets/components/memo-browser.less";

export default function MemoBrowser() {
    const memos = useSelector(selectMemos);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 查看备忘录详情
    const handleView = (memoId: string) => {
        navigate(`/memo/${memoId}`);
    };

    // 删除备忘录
    const handleDelete = async (memoId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm("确定要删除这条备忘录吗？")) {
            return;
        }

        try {
            const response = await deleteMemo(memoId);
            if (response.status) {
                dispatch(removeMemo(memoId));
            }
        } catch (error) {
            console.error("删除失败:", error);
        }
    };

    // 格式化日期
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    if (memos.length === 0) {
        return (
            <div className="memo-browser-empty">
                <FileText size={64} />
                <p>还没有备忘录</p>
                <span>在"我的文档"中选择文件生成备忘录</span>
            </div>
        );
    }

    return (
        <div className="memo-browser">
            <div className="memo-grid">
                {memos.map((memo) => (
                    <div
                        key={memo.id}
                        className="memo-card"
                        onClick={() => handleView(memo.id)}
                    >
                        <div className="memo-card-header">
                            <FileText className="memo-icon" />
                            <button
                                className="delete-btn"
                                onClick={(e) => handleDelete(memo.id, e)}
                                title="删除"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="memo-card-body">
                            <h3 className="memo-title">{memo.title}</h3>
                            <div className="memo-source">
                                <File size={14} />
                                <span>来源：{memo.sourceFileName}</span>
                            </div>
                            <div className="memo-date">
                                <Calendar size={14} />
                                <span>{formatDate(memo.createdAt)}</span>
                            </div>
                        </div>

                        <div className="memo-card-footer">
                            <button className="view-btn">
                                <Eye size={14} />
                                <span>查看详情</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
