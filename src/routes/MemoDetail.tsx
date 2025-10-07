import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft, Trash2, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import Markdown from "@/components/Markdown.tsx";
import { getMemo, deleteMemo } from "@/api/memo.ts";
import { removeMemo } from "@/store/memo.ts";
import type { MemoInfo } from "@/api/memo.ts";
import "@/assets/pages/memo-detail.less";

export default function MemoDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [memo, setMemo] = useState<MemoInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadMemo(id);
        }
    }, [id]);

    const loadMemo = async (memoId: string) => {
        setLoading(true);
        try {
            const response = await getMemo(memoId);
            if (response.status && response.data) {
                setMemo(response.data);
            } else {
                console.error("加载失败:", response.error);
            }
        } catch (error) {
            console.error("加载失败:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/myhome");
    };

    const handleDelete = async () => {
        if (!memo) return;

        if (!confirm("确定要删除这条备忘录吗？")) {
            return;
        }

        try {
            const response = await deleteMemo(memo.id);
            if (response.status) {
                dispatch(removeMemo(memo.id));
                navigate("/myhome");
            }
        } catch (error) {
            console.error("删除失败:", error);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="memo-detail loading">
                <div className="loading-spinner">加载中...</div>
            </div>
        );
    }

    if (!memo) {
        return (
            <div className="memo-detail error">
                <div className="error-message">
                    <p>备忘录不存在</p>
                    <Button onClick={handleBack}>返回</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="memo-detail">
            <div className="memo-detail-header">
                <div className="header-left">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ArrowLeft size={18} />
                        <span>返回</span>
                    </Button>
                </div>
                <div className="header-right">
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 size={16} />
                        <span>删除</span>
                    </Button>
                </div>
            </div>

            <div className="memo-detail-content">
                <div className="memo-header-info">
                    <h1 className="memo-title">{memo.title}</h1>
                    <div className="memo-meta">
                        <div className="meta-item">
                            <FileText size={16} />
                            <span>来源文件：{memo.sourceFileName}</span>
                        </div>
                        <div className="meta-item">
                            <Calendar size={16} />
                            <span>创建时间：{formatDate(memo.createdAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="memo-divider"></div>

                <div className="memo-content-wrapper">
                    <Markdown>{memo.content}</Markdown>
                </div>
            </div>
        </div>
    );
}
