import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button.tsx";
import { 
    ChevronRight,
    Crop,
    RefreshCw,
    X,
    Image,
    FileUp,
    MessageCircle,
    Search
} from "lucide-react";
import ChatInput from "@/components/home/assemblies/ChatInput.tsx";
import { ChatAction } from "@/components/home/assemblies/ChatAction.tsx";
import MessageSegment from "@/components/Message.tsx";
import Markdown from "@/components/Markdown.tsx";
import { cn } from "@/components/ui/lib/utils.ts";
import { selectFiles } from "@/store/document.ts";
import "@/assets/pages/pdf-viewer.less";

function PDFViewer() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const allFiles = useSelector(selectFiles);
    const allDocuments = useSelector((state: any) => state.document.documents);
    
    // 获取文件的完整路径
    const getFilePath = (fileId: string): string[] => {
        const path: string[] = [];
        let current = allDocuments.find((doc: any) => doc.id === fileId);
        
        while (current) {
            path.unshift(current.name);
            if (!current.parentId) break;
            current = allDocuments.find((doc: any) => doc.id === current.parentId);
        }
        
        // 在最前面添加"我的文档"作为根目录
        if (path.length > 0) {
            path.unshift("我的文档");
        }
        
        return path;
    };
    
    // 基础状态
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(10);
    const [activeRightTab, setActiveRightTab] = useState<"chat" | "memo" | "quiz">("chat");
    
    // 文件列表和展开状态
    const [fileListExpanded, setFileListExpanded] = useState(false);
    
    // 从 URL 参数中获取当前文件
    const currentFile = allFiles.find(f => f.id === id);
    const recentFiles = allFiles.slice(0, 10); // 只显示最近 10 个文件
    const currentPath = currentFile ? getFilePath(currentFile.id) : [];
    
    // 可调整大小的面板尺寸
    const [leftSidebarWidth, setLeftSidebarWidth] = useState(240);
    const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
    const [contentSectionHeight, setContentSectionHeight] = useState(250);
    
    // 左侧栏内部可调整的分割比例
    const [thumbnailHeight, setThumbnailHeight] = useState(300);
    const [breadcrumbHeight, setBreadcrumbHeight] = useState(100);
    
    // 拖动状态
    const [isDragging, setIsDragging] = useState<string | null>(null);
    const dragStartPos = useRef({ x: 0, y: 0, initialSize: 0 });
    const inputRef = useRef<HTMLTextAreaElement>(null);
    
    const [chatMessages, setChatMessages] = useState([
        { role: "assistant", content: "您好!我是 AI 助手,可以帮您理解这份文档。请问有什么问题吗?" }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [memoContent, setMemoContent] = useState("");
    const [memoGenerated, setMemoGenerated] = useState(false); // 是否已生成备忘录
    
    // Quiz 相关状态
    const [quizType, setQuizType] = useState<"multiple" | "truefalse" | "shortanswer">("multiple");
    const [quizCount, setQuizCount] = useState(5);
    const [quizDifficulty, setQuizDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
    const [quizGenerated, setQuizGenerated] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false); // 是否已提交
    const [quizQuestions, setQuizQuestions] = useState<Array<{
        question: string;
        options: string[];
        answer: number;
        type: "multiple" | "truefalse" | "shortanswer";
    }>>([]);
    
    const [showCapturePanel, setShowCapturePanel] = useState(false);
    const [captureText, setCaptureText] = useState("");
    const [captureNote, setCaptureNote] = useState("");
    
    // 拖动处理函数
    const handleMouseDown = (type: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖱️ 开始拖动:', type);
        setIsDragging(type);
        dragStartPos.current = {
            x: e.clientX,
            y: e.clientY,
            initialSize: 
                type === 'left-sidebar' ? leftSidebarWidth :
                type === 'right-sidebar' ? rightSidebarWidth :
                type === 'content-section' ? contentSectionHeight :
                type === 'thumbnail' ? thumbnailHeight :
                type === 'breadcrumb' ? breadcrumbHeight : 0
        };
        console.log('初始位置:', dragStartPos.current);
    };
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - dragStartPos.current.x;
            const deltaY = e.clientY - dragStartPos.current.y;
            
            switch (isDragging) {
                case 'left-sidebar':
                    setLeftSidebarWidth(Math.max(180, Math.min(400, dragStartPos.current.initialSize + deltaX)));
                    break;
                case 'right-sidebar':
                    setRightSidebarWidth(Math.max(250, Math.min(500, dragStartPos.current.initialSize - deltaX)));
                    break;
                case 'content-section':
                    const newHeight = Math.max(150, Math.min(500, dragStartPos.current.initialSize - deltaY));
                    console.log('📏 Content高度:', dragStartPos.current.initialSize, '→', newHeight, 'deltaY:', deltaY);
                    setContentSectionHeight(newHeight);
                    break;
                case 'thumbnail':
                    setThumbnailHeight(Math.max(150, dragStartPos.current.initialSize + deltaY));
                    break;
                case 'breadcrumb':
                    setBreadcrumbHeight(Math.max(60, dragStartPos.current.initialSize + deltaY));
                    break;
            }
        };
        
        const handleMouseUp = () => {
            console.log('✋ 停止拖动');
            setIsDragging(null);
            document.body.classList.remove('dragging', 'dragging-vertical');
        };
        
        if (isDragging) {
            // 添加拖动时的body类
            if (isDragging === 'left-sidebar' || isDragging === 'right-sidebar') {
                document.body.classList.add('dragging');
            } else {
                document.body.classList.add('dragging-vertical');
            }
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);
    
    // 聊天和截图操作函数
    const handleSendMessage = () => {
        if (chatInput.trim()) {
            setChatMessages([
                ...chatMessages,
                { role: "user", content: chatInput },
                { role: "assistant", content: "这是 AI 的回复..." }
            ]);
            setChatInput("");
        }
    };
    
    const handleClose = () => navigate(-1);
    
    // 截图功能 - 开启 PDF 上的框选模式
    const handleCapture = () => {
        // TODO: 实现 PDF 上的框选截图功能
        alert('请在 PDF 上拖动鼠标框选区域进行截图，按 ESC 取消');
    };
    
    // 保存截图和笔记
    const handleSaveCapture = () => {
        console.log("保存截图和笔记:", { captureText, captureNote });
        setShowCapturePanel(false);
        setCaptureText("");
        setCaptureNote("");
    };
    
    // 新对话
    const handleNewChat = () => {
        setChatMessages([{
            role: "assistant",
            content: "您好！我是 AI 助手，可以帮您理解这份文档。请问有什么问题吗？"
        }]);
        setChatInput("");
    };
    
    // 历史对话
    const handleHistory = () => {
        // TODO: 打开历史对话列表
        alert('历史对话功能待实现');
    };
    
    // 生成备忘录
    const handleGenerateMemo = () => {
        // TODO: 调用 AI 生成备忘录
        const generatedMemo = `# 文档备忘录\n\n## 主要内容\n- 这是 AI 生成的备忘录\n- 包含文档的关键点\n- 支持 Markdown 格式\n\n## 重点提示\n此处展示文档的重要信息...`;
        setMemoContent(generatedMemo);
        setMemoGenerated(true);
    };
    
    // 复制备忘录
    const handleCopyMemo = () => {
        if (memoContent) {
            navigator.clipboard.writeText(memoContent);
            alert('备忘录已复制到剪贴板');
        }
    };
    
    // 生成 Quiz
    const handleGenerateQuiz = () => {
        // TODO: 调用 AI 生成 Quiz
        const newQuestions = [];
        
        for (let i = 0; i < quizCount; i++) {
            if (quizType === "multiple") {
                newQuestions.push({
                    question: `题目 ${i + 1}: 根据文档内容，以下哪个选项是正确的？`,
                    options: ["选项 A", "选项 B", "选项 C", "选项 D"],
                    answer: Math.floor(Math.random() * 4),
                    type: "multiple" as const
                });
            } else if (quizType === "truefalse") {
                newQuestions.push({
                    question: `题目 ${i + 1}: 根据文档内容，以下陈述是正确的吗？`,
                    options: ["正确", "错误"],
                    answer: Math.floor(Math.random() * 2),
                    type: "truefalse" as const
                });
            } else {
                newQuestions.push({
                    question: `题目 ${i + 1}: 请简述文档中的某个重要概念。`,
                    options: [],
                    answer: 0,
                    type: "shortanswer" as const
                });
            }
        }
        
        setQuizQuestions(newQuestions);
        setSelectedAnswers({});
        setQuizGenerated(true);
    };
    
    // 选择答案
    const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: optionIndex
        });
    };
    
    // 提交 Quiz
    const handleSubmitQuiz = () => {
        setQuizSubmitted(true);
    };
    
    // 重置 Quiz 回到配置界面
    const handleResetQuiz = () => {
        setQuizGenerated(false);
        setQuizSubmitted(false);
        setSelectedAnswers({});
        setQuizQuestions([]);
    };
    
    // 查看新生成
    const handleViewNewQuiz = () => {
        setQuizSubmitted(false);
        setSelectedAnswers({});
        handleGenerateQuiz();
    };

    return (
        <div className="pdf-viewer-page">
            {/* 主内容区域 - 左中右三栏,每栏有自己的顶部 */}
            <div className="pdf-viewer-container">
                {/* 左侧边栏 */}
                <aside className="pdf-left-sidebar" style={{ width: `${leftSidebarWidth}px` }}>
                    {/* 左侧顶部: Logo */}
                    <div className="sidebar-header">
                        <img src="/logo.png" alt="Logo" className="sidebar-logo" />
                    </div>
                    
                    {/* 缩略图列表 */}
                    <div className="thumbnails-list">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <div
                                key={page}
                                className={`thumbnail-item ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                <div className="thumbnail-preview">
                                    {/* PDF 页面预览占位符 */}
                                </div>
                                <div className="thumbnail-page-label">第 {page} 页</div>
                            </div>
                        ))}
                    </div>
                    
                    {/* 左侧边栏右侧拖动手柄 */}
                    <div 
                        className="resize-handle resize-handle-vertical"
                        onMouseDown={(e) => handleMouseDown('left-sidebar', e)}
                    />
                </aside>

                {/* 中间区域 */}
                <main className="pdf-main-content">
                    {/* 中间顶部: 导航栏 */}
                    <div className="main-header">
                        <div className="file-path-dropdown">
                            <button 
                                className="file-path-button"
                                onClick={() => setFileListExpanded(!fileListExpanded)}
                            >
                                <span className="file-name">
                                    {currentPath.length > 0 ? (
                                        currentPath.map((name, index) => (
                                            <span key={index}>
                                                {name}
                                                {index < currentPath.length - 1 && (
                                                    <ChevronRight size={12} className="path-separator-inline" style={{ display: 'inline', margin: '0 4px' }} />
                                                )}
                                            </span>
                                        ))
                                    ) : "未知文件"}
                                </span>
                                <ChevronRight 
                                    size={14} 
                                    className={`path-chevron ${fileListExpanded ? 'expanded' : ''}`}
                                />
                            </button>
                            
                            {fileListExpanded && (
                                <div className="file-list-dropdown">
                                    {recentFiles.map((file) => {
                                        const filePath = getFilePath(file.id);
                                        return (
                                            <div
                                                key={file.id}
                                                className={`file-list-item ${file.id === id ? 'active' : ''}`}
                                                onClick={() => {
                                                    navigate(`/pdf/${file.id}`);
                                                    setFileListExpanded(false);
                                                }}
                                            >
                                                <span className="file-name-text">
                                                    {filePath.map((name, index) => (
                                                        <span key={index}>
                                                            {name}
                                                            {index < filePath.length - 1 && (
                                                                <ChevronRight size={10} style={{ display: 'inline', margin: '0 4px', opacity: 0.5 }} />
                                                            )}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* 上半部分: PDF 显示区域 */}
                    <div className="pdf-display-section">
                        <div className="pdf-canvas-wrapper">
                            <div className="pdf-canvas">
                                <div className="pdf-page-placeholder">
                                    <p>PDF 文档内容</p>
                                    <p>第 {currentPage} / {totalPages} 页</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 下半部分: Markdown + LaTeX 渲染区域 */}
                    <div className="content-render-section" style={{ height: `${contentSectionHeight}px` }}>
                        {/* 拖动手柄在顶部 */}
                        <div 
                            className="resize-handle resize-handle-horizontal"
                            onMouseDown={(e) => handleMouseDown('content-section', e)}
                        />
                        <div className="content-header">
                            <span>Content</span>
                        </div>
                        <div className="content-body">
                            <p>用 Markdown + LaTeX 渲染</p>
                            <p>此处显示文档提取的文本内容</p>
                        </div>
                    </div>
                </main>

                {/* 右侧边栏 */}
                <aside className="pdf-right-sidebar" style={{ width: `${rightSidebarWidth}px` }}>
                    {/* 右侧边栏左侧拖动手柄 */}
                    <div 
                        className="resize-handle resize-handle-vertical resize-handle-left"
                        onMouseDown={(e) => handleMouseDown('right-sidebar', e)}
                    />
                    
                    {/* 右侧顶部: 标签切换 + 按钮 */}
                    <div className="sidebar-header-right">
                        <div className="header-tabs">
                            <button
                                className={`header-tab ${activeRightTab === 'chat' ? 'active' : ''}`}
                                onClick={() => setActiveRightTab('chat')}
                            >
                                AI Chat
                            </button>
                            <button
                                className={`header-tab ${activeRightTab === 'memo' ? 'active' : ''}`}
                                onClick={() => setActiveRightTab('memo')}
                            >
                                Memo
                            </button>
                            <button
                                className={`header-tab ${activeRightTab === 'quiz' ? 'active' : ''}`}
                                onClick={() => setActiveRightTab('quiz')}
                            >
                                Quiz
                            </button>
                        </div>
                        <div className="header-actions">
                            <Button variant="ghost" size="icon" className="chat-action-btn" onClick={handleNewChat} title="新对话">
                                <MessageCircle size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="chat-action-btn" onClick={handleHistory} title="历史对话">
                                <FileUp size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
                                <RefreshCw size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleClose}>
                                <X size={18} />
                            </Button>
                        </div>
                    </div>
                    
                    {/* 右侧内容区 */}
                    <div className="right-sidebar-content">
                        {activeRightTab === 'chat' && (
                            <div className="pdf-chat-panel">
                                {/* 聊天消息区域 */}
                                <div className="pdf-chat-messages">
                                    {chatMessages.map((msg, index) => (
                                        <MessageSegment
                                            key={index}
                                            message={{
                                                role: msg.role,
                                                content: msg.content,
                                                keyword: ""
                                            }}
                                            end={index === chatMessages.length - 1}
                                            onEvent={() => {}}
                                            index={index}
                                            selected={false}
                                            onFocus={() => {}}
                                            onFocusLeave={() => {}}
                                        />
                                    ))}
                                </div>
                                
                                {/* 底部输入区域 */}
                                <div className="pdf-chat-input">
                                    {/* 操作按钮栏 */}
                                    <div className="input-action">
                                        <ChatAction 
                                            className={cn("knowledge-search")}
                                            text="知识检索"
                                        >
                                            <Search className="h-4 w-4" />
                                        </ChatAction>
                                        <ChatAction text="截图" onClick={handleCapture}>
                                            <Crop className="h-4 w-4" />
                                        </ChatAction>
                                        <ChatAction text="上传" onClick={() => setShowCapturePanel(!showCapturePanel)}>
                                            <Image className="h-4 w-4" />
                                        </ChatAction>
                                    </div>
                                    
                                    {/* 输入框区域 */}
                                    <div className="input-wrapper">
                                        <div className="chat-box no-scrollbar">
                                            <ChatInput
                                                target={inputRef}
                                                value={chatInput}
                                                onValueChange={setChatInput}
                                                onEnterPressed={handleSendMessage}
                                            />
                                        </div>
                                        <Button 
                                            onClick={handleSendMessage} 
                                            size="icon" 
                                            className="send-action"
                                        >
                                            <ChevronRight size={20} />
                                        </Button>
                                    </div>
                                    
                                    {/* AI 提示文字 */}
                                    <div className="ai-notice">
                                        由AI模型生成，仅限本文件检索
                                    </div>
                                </div>
                            </div>
                        )}                        {activeRightTab === 'memo' && (
                            <div className="memo-panel">
                                <div className="memo-toolbar">
                                    <span className="memo-title">文档备忘录</span>
                                    <div className="memo-actions">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={handleGenerateMemo}
                                        >
                                            {memoGenerated ? '重新生成' : '生成备忘录'}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={handleCopyMemo}
                                            disabled={!memoContent}
                                        >
                                            复制
                                        </Button>
                                    </div>
                                </div>
                                <div className="memo-content">
                                    {memoContent ? (
                                        <Markdown className="memo-markdown">{memoContent}</Markdown>
                                    ) : (
                                        <div className="memo-placeholder">
                                            点击“生成备忘录”让 AI 帮您总结文档内容
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {activeRightTab === 'quiz' && (
                            <div className="quiz-panel">
                                {!quizGenerated ? (
                                    <div className="quiz-config">
                                        <h3 className="quiz-config-title">配置 Quiz</h3>
                                        
                                        <div className="quiz-config-section">
                                            <label className="quiz-label">题型：</label>
                                            <div className="quiz-type-options">
                                                <label className="quiz-type-option">
                                                    <input
                                                        type="radio"
                                                        name="quizType"
                                                        checked={quizType === "multiple"}
                                                        onChange={() => setQuizType("multiple")}
                                                    />
                                                    <span>单选题</span>
                                                </label>
                                                <label className="quiz-type-option">
                                                    <input
                                                        type="radio"
                                                        name="quizType"
                                                        checked={quizType === "truefalse"}
                                                        onChange={() => setQuizType("truefalse")}
                                                    />
                                                    <span>判断题</span>
                                                </label>
                                                <label className="quiz-type-option">
                                                    <input
                                                        type="radio"
                                                        name="quizType"
                                                        checked={quizType === "shortanswer"}
                                                        onChange={() => setQuizType("shortanswer")}
                                                    />
                                                    <span>问答题</span>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div className="quiz-config-section">
                                            <label className="quiz-label">题数：</label>
                                            <select 
                                                className="quiz-select"
                                                value={quizCount}
                                                onChange={(e) => setQuizCount(Number(e.target.value))}
                                            >
                                                <option value={3}>3</option>
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={15}>15</option>
                                            </select>
                                        </div>
                                        
                                        <div className="quiz-config-section">
                                            <label className="quiz-label">难度：</label>
                                            <select 
                                                className="quiz-select"
                                                value={quizDifficulty}
                                                onChange={(e) => setQuizDifficulty(e.target.value as any)}
                                            >
                                                <option value="easy">简单</option>
                                                <option value="medium">中等</option>
                                                <option value="hard">困难</option>
                                            </select>
                                        </div>
                                        
                                        <Button 
                                            className="quiz-generate-btn"
                                            onClick={handleGenerateQuiz}
                                        >
                                            生成 Quiz
                                        </Button>
                                    </div>
                                ) : quizSubmitted ? (
                                    // 小结回顾界面
                                    <div className="quiz-summary">
                                        <div className="quiz-summary-header">
                                            <h3>小结回顾</h3>
                                            <div className="quiz-score">
                                                <span className="score-value">
                                                    {Object.values(selectedAnswers).filter((ans, idx) => ans === quizQuestions[idx]?.answer).length} / {quizQuestions.length}
                                                </span>
                                                <span className="score-percent">
                                                    {Math.round((Object.values(selectedAnswers).filter((ans, idx) => ans === quizQuestions[idx]?.answer).length / quizQuestions.length) * 100)}% 正确率
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="quiz-results">
                                            {quizQuestions.map((q, index) => {
                                                const userAnswer = selectedAnswers[index];
                                                const isCorrect = userAnswer === q.answer;
                                                
                                                return (
                                                    <div key={index} className={`quiz-result-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                                                        <div className="result-header">
                                                            <span className="question-num">题目 {index + 1}</span>
                                                            <span className={`result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                                                                {isCorrect ? '✓ 正确' : '✗ 错误'}
                                                            </span>
                                                        </div>
                                                        <p className="question-text">{q.question}</p>
                                                        <div className="answer-comparison">
                                                            <div className="answer-row">
                                                                <span className="answer-label">你的答案：</span>
                                                                <span className={`answer-value ${isCorrect ? '' : 'wrong'}`}>
                                                                    {userAnswer !== undefined ? q.options[userAnswer] : '未作答'}
                                                                </span>
                                                            </div>
                                                            {!isCorrect && (
                                                                <div className="answer-row">
                                                                    <span className="answer-label">正确答案：</span>
                                                                    <span className="answer-value correct">{q.options[q.answer]}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        
                                        <div className="quiz-summary-actions">
                                            <Button 
                                                variant="outline"
                                                onClick={handleResetQuiz}
                                            >
                                                返回配置界面
                                            </Button>
                                            <Button 
                                                onClick={handleViewNewQuiz}
                                            >
                                                查看新生成
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // 答题界面
                                    <>
                                        <div className="quiz-header">
                                            <h3>文档测验 ({quizQuestions.length} 道题)</h3>
                                            <Button 
                                                variant="ghost"
                                                size="sm" 
                                                onClick={() => setQuizGenerated(false)}
                                            >
                                                重新配置
                                            </Button>
                                        </div>
                                        <div className="quiz-questions">
                                            {quizQuestions.map((q, index) => (
                                                <div key={index} className="quiz-question-card">
                                                    <p className="question-text">
                                                        {index + 1}. {q.question}
                                                    </p>
                                                    {q.type === "shortanswer" ? (
                                                        <textarea
                                                            className="quiz-answer-input"
                                                            placeholder="请输入你的答案..."
                                                            rows={4}
                                                        />
                                                    ) : (
                                                        <div className="question-options">
                                                            {q.options.map((opt, i) => (
                                                                <label 
                                                                    key={i} 
                                                                    className={`option-label ${
                                                                        selectedAnswers[index] === i ? 'selected' : ''
                                                                    }`}
                                                                >
                                                                    <input 
                                                                        type="radio" 
                                                                        name={`q${index}`}
                                                                        checked={selectedAnswers[index] === i}
                                                                        onChange={() => handleSelectAnswer(index, i)}
                                                                    />
                                                                    <span>{opt}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="quiz-footer">
                                            <Button 
                                                className="quiz-submit-btn"
                                                onClick={handleSubmitQuiz}
                                            >
                                                提交 Quiz
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* 截图和引用面板 */}
            {showCapturePanel && (
                <div className="capture-panel">
                    <div className="capture-panel-header">
                        <h3>引用和笔记</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowCapturePanel(false)}>
                            <X size={16} />
                        </Button>
                    </div>
                    <div className="capture-panel-content">
                        <div className="capture-section">
                            <label className="capture-label">引用文字</label>
                            <textarea
                                value={captureText}
                                onChange={(e) => setCaptureText(e.target.value)}
                                placeholder="选中的文本内容..."
                                className="capture-textarea"
                                rows={3}
                            />
                        </div>
                        <div className="capture-section">
                            <label className="capture-label">用户输入内容</label>
                            <textarea
                                value={captureNote}
                                onChange={(e) => setCaptureNote(e.target.value)}
                                placeholder="添加您的笔记..."
                                className="capture-textarea"
                                rows={4}
                            />
                        </div>
                        <div className="capture-actions">
                            <Button variant="outline" size="sm">
                                <Image size={16} />
                                从截图开始
                            </Button>
                            <Button variant="outline" size="sm">
                                <FileUp size={16} />
                                上传图片
                            </Button>
                            <Button variant="outline" size="sm">
                                <MessageCircle size={16} />
                                闲聊对话框
                            </Button>
                        </div>
                        <div className="capture-footer">
                            <span className="ai-notice">内容由大模型生成，原因如实说</span>
                            <div className="capture-footer-buttons">
                                <Button variant="ghost" size="sm" onClick={() => setShowCapturePanel(false)}>
                                    取消
                                </Button>
                                <Button size="sm" onClick={handleSaveCapture}>
                                    保存
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PDFViewer;
