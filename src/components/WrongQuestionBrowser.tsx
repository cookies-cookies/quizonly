import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronRight } from "lucide-react";
import "@/assets/components/wrong-question-browser.less";

interface WrongQuestion {
    id: string;
    question: string;
    analysis: string;
    expanded?: boolean;
}

export default function WrongQuestionBrowser() {
    const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([
        {
            id: "1",
            question: "根据文档内容，以下哪个选项是正确的？A. 选项A  B. 选项B  C. 选项C  D. 选项D",
            analysis: "这道题考查的是文档核心概念的理解。正确答案是C，因为...",
            expanded: false,
        },
        {
            id: "2",
            question: "关于文档中提到的重要知识点，下列说法正确的是？",
            analysis: "本题主要考察对重点内容的掌握程度。答案解析：...",
            expanded: false,
        },
        {
            id: "3",
            question: "以下哪项不属于文档中讨论的范畴？",
            analysis: "本题为排除型选择题，需要仔细分析每个选项...",
            expanded: false,
        },
    ]);

    const handleDelete = (questionId: string) => {
        console.log("删除题目:", questionId);
        setWrongQuestions(wrongQuestions.filter(q => q.id !== questionId));
    };

    const handleToggleExpand = (questionId: string) => {
        setWrongQuestions(wrongQuestions.map(q => 
            q.id === questionId ? { ...q, expanded: !q.expanded } : q
        ));
    };

    return (
        <div className="wrong-question-browser">
            <div className="wq-questions-list">
                {wrongQuestions.map((question) => (
                    <div key={question.id} className={`wq-question-card ${question.expanded ? 'expanded' : ''}`}>
                        <div className="wq-card-content">
                            {/* 题目信息 */}
                            <div className="wq-info">
                                <div className="wq-section">
                                    <span className="wq-label">题干：</span>
                                    <span className="wq-text">{question.question}</span>
                                </div>
                                
                                {question.expanded && (
                                    <div className="wq-section">
                                        <span className="wq-label">解析：</span>
                                        <span className="wq-text">{question.analysis}</span>
                                    </div>
                                )}
                            </div>

                            {/* 右下角操作按钮 */}
                            <div className="wq-actions">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(question.id)}
                                    className="wq-delete-btn"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    删除本题
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleExpand(question.id)}
                                    className="wq-detail-btn"
                                >
                                    {question.expanded ? '收起' : '进入详情'}
                                    <ChevronRight className={`h-4 w-4 ml-1 ${question.expanded ? 'rotated' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
