import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/assets/pages/wrong-questions.less";

interface QuestionItem {
    id: string;
    title: string;
    type: "key" | "error" | "lowfreq";
    status: "pending" | "ongoing" | "completed";
    errorPoint?: string;
    progress?: string;
}

export default function WrongQuestions() {
    const [questions] = useState<QuestionItem[]>([
        {
            id: "1",
            title: "关键",
            type: "key",
            status: "pending",
        },
        {
            id: "2",
            title: "出错",
            type: "error",
            status: "pending",
            errorPoint: "出错点呼叫",
        },
        {
            id: "3",
            title: "低频列表",
            type: "lowfreq",
            status: "ongoing",
            errorPoint: "呼叫",
            progress: "1条正在进行",
        },
    ]);

    const handleRefresh = () => {
        console.log("刷新错题集");
        // TODO: 实现刷新逻辑
    };

    const handleTransfer = () => {
        console.log("转移题集");
        // TODO: 实现转移题集逻辑
    };

    const handleDragStart = (e: React.DragEvent, questionId: string) => {
        e.dataTransfer.setData("questionId", questionId);
        e.currentTarget.classList.add("dragging");
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove("dragging");
    };

    const getQuestionIcon = (type: string) => {
        switch (type) {
            case "key":
                return "🔸";
            case "error":
                return "📖";
            case "lowfreq":
                return "⚪";
            default:
                return "📝";
        }
    };

    return (
        <div className="wrong-questions-page">
            {/* 左侧导航栏 */}
            <aside className="wq-sidebar">
                <div className="wq-logo">
                    <img src="/logo.png" alt="Logo" />
                </div>
                
                <nav className="wq-nav">
                    <a href="/myhome" className="wq-nav-item">
                        我的空间
                    </a>
                    <a href="#" className="wq-nav-item">
                        重点备忘
                    </a>
                    <a href="#" className="wq-nav-item active">
                        错题集
                    </a>
                </nav>

                <div className="wq-sidebar-footer">
                    <a href="#" className="wq-footer-link">指南</a>
                    <a href="#" className="wq-footer-link">FAQ</a>
                    <a href="#" className="wq-footer-link">客服</a>
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="wq-main">
                <div className="wq-header">
                    <h1 className="wq-title">错题集</h1>
                    
                    <div className="wq-header-actions">
                        <Button
                            variant="outline"
                            onClick={handleTransfer}
                            className="wq-transfer-btn"
                        >
                            转移题集
                        </Button>
                        
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            className="wq-refresh-btn"
                        >
                            <RefreshCw size={20} />
                        </Button>
                    </div>
                </div>

                <div className="wq-content">
                    <div className="wq-questions-list">
                        {questions.map((question) => (
                            <div
                                key={question.id}
                                className={`wq-question-card ${question.type}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, question.id)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="wq-card-header">
                                    <span className="wq-card-icon">
                                        {getQuestionIcon(question.type)}
                                    </span>
                                    <span className="wq-card-title">
                                        {question.title}
                                    </span>
                                    {question.type === "key" && (
                                        <span className="wq-drag-hint">
                                            左侧可拖动训练
                                        </span>
                                    )}
                                </div>

                                {question.errorPoint && (
                                    <div className="wq-card-content">
                                        <span className="wq-error-point">
                                            {question.errorPoint}
                                        </span>
                                    </div>
                                )}

                                {question.progress && (
                                    <div className="wq-card-footer">
                                        <span className="wq-progress">
                                            {question.progress}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
