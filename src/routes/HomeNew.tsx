import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
    selectUsername, 
    selectUserId, 
    selectIsVip,
    selectMembershipLevel,
    selectSubscription,
    selectUsageRecords,
    logout 
} from "@/store/auth.ts";
import { selectTasks, addTask, updateTaskStatus, setTaskError } from "@/store/task.ts";
import { selectCurrentFolderId, selectDocuments, addDocument, setDocuments, setCurrentFolder } from "@/store/document.ts";
import { addMemo, setMemos } from "@/store/memo.ts";
import { uploadFile, createFolder, getDocuments } from "@/api/document.ts";
import { getMemos, createMemo } from "@/api/memo.ts";
import type { DocumentInfo } from "@/api/document.ts";
import { appLogo, appName } from "@/conf/env.ts";
import {
    Folder,
    BookOpen,
    ArrowLeftRight,
    X,
    Upload,
    FolderPlus,
    StickyNote,
    LogOut,
    Coins,
    Settings,
    ChevronRight,
    Home,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import Avatar from "@/components/Avatar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import UploadDialog from "@/components/UploadDialog.tsx";
import FolderDialog from "@/components/FolderDialog.tsx";
import FileBrowser from "@/components/FileBrowser.tsx";
import SelectFileDialog from "@/components/SelectFileDialog.tsx";
import MemoBrowser from "@/components/MemoBrowser.tsx";
import EnhancedSearch from "@/components/EnhancedSearch.tsx";
import "@/assets/pages/home-new.less";

function HomeNew() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector(selectUsername);
    const userId = useSelector(selectUserId);
    const isVip = useSelector(selectIsVip);
    const membershipLevel = useSelector(selectMembershipLevel);
    const subscription = useSelector(selectSubscription);
    const usageRecords = useSelector(selectUsageRecords);
    const tasks = useSelector(selectTasks);
    const currentFolderId = useSelector(selectCurrentFolderId);
    const allDocuments = useSelector(selectDocuments);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [folderDialogOpen, setFolderDialogOpen] = useState(false);
    const [selectFileDialogOpen, setSelectFileDialogOpen] = useState(false);
    const [currentView, setCurrentView] = useState<"documents" | "memos">("documents");
    const [leftSidebarWidth, setLeftSidebarWidth] = useState(240);
    const [isDragging, setIsDragging] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // 从 API 加载文档数据
    useEffect(() => {
        const loadDocuments = async () => {
            const response = await getDocuments();
            if (response.status && response.data) {
                dispatch(setDocuments(response.data));
            }
        };
        loadDocuments();
    }, [dispatch]);
    
    // 从 API 加载备忘录数据
    useEffect(() => {
        const loadMemos = async () => {
            const response = await getMemos();
            if (response.status && response.data) {
                dispatch(setMemos(response.data));
            }
        };
        loadMemos();
    }, [dispatch]);
    
    // 退出登录
    const handleLogout = () => {
        dispatch(logout());
    };
    
    // 跳转设置页面
    const handleSettings = () => {
        navigate("/settings");
    };
    
    // 打开上传对话框
    const handleOpenUpload = () => {
        setUploadDialogOpen(true);
    };
    
    // 打开新建文件夹对话框
    const handleCreateFolder = () => {
        setFolderDialogOpen(true);
    };

    // 确认创建文件夹
    const handleFolderCreate = async (folderName: string) => {
        try {
            const response = await createFolder(folderName, currentFolderId || undefined);
            
            if (response.status && response.data) {
                // 成功创建文件夹，添加到 store
                dispatch(addDocument(response.data));
                setFolderDialogOpen(false);
            } else {
                // TODO: 显示错误提示
                console.error("创建文件夹失败:", response.error);
            }
        } catch (error) {
            console.error("创建文件夹失败:", error);
        }
    };

    // 计算面包屑路径
    const getBreadcrumbPath = () => {
        const path: { id: string | null; name: string }[] = [{ id: null, name: "我的文档" }];
        
        if (currentFolderId) {
            let currentId: string | null = currentFolderId;
            const pathSegments: { id: string | null; name: string }[] = [];
            
            // 向上追溯父文件夹
            while (currentId) {
                const folder = allDocuments.find(doc => doc.id === currentId);
                if (folder) {
                    pathSegments.unshift({ id: folder.id, name: folder.name });
                    currentId = folder.parentId;
                } else {
                    break;
                }
            }
            
            path.push(...pathSegments);
        }
        
        return path;
    };

    // 导航到指定文件夹
    const navigateToFolder = (folderId: string | null) => {
        dispatch(setCurrentFolder(folderId));
    };

    const breadcrumbPath = getBreadcrumbPath();
    
    // 打开创建备忘录对话框
    const handleOpenCreateMemo = () => {
        setSelectFileDialogOpen(true);
    };

    // 处理搜索
    const handleSearch = (query: string) => {
        setIsSearching(true);
        
        // 模拟搜索延迟
        setTimeout(() => {
            // 在所有文档中搜索
            const results = allDocuments
                .filter(doc => 
                    doc.name.toLowerCase().includes(query.toLowerCase())
                )
                .map(doc => ({
                    id: doc.id,
                    name: doc.name,
                    type: doc.type,
                    path: doc.parentId ? "我的文档 / ..." : "我的文档",
                    excerpt: doc.type === "file" && doc.size ? `大小: ${(doc.size / 1024).toFixed(2)} KB` : undefined
                }));
            
            setSearchResults(results);
            setIsSearching(false);
        }, 300);
    };

    // 处理深度搜索
    const handleDeepSearch = (query: string) => {
        console.log("深度搜索:", query);
        // TODO: 实现 AI 深度搜索逻辑
        setIsSearching(true);
        setTimeout(() => {
            setSearchResults([]);
            setIsSearching(false);
        }, 500);
    };

    // 确认创建备忘录
    const handleCreateMemoConfirm = async (files: DocumentInfo[]) => {
        setSelectFileDialogOpen(false);
        
        // 为每个文件创建备忘录
        for (const file of files) {
            // 创建任务记录
            const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            dispatch(addTask({
                id: taskId,
                fileName: `生成 ${file.name} 的备忘录`,
                status: "processing",
                progress: 0,
                createdAt: new Date().toISOString(),
            }));

            try {
                // 调用 AI 生成备忘录
                const response = await createMemo(file.id, file.name);
                
                if (response.status && response.data) {
                    dispatch(addMemo(response.data));
                    dispatch(updateTaskStatus({
                        id: taskId,
                        status: "completed",
                    }));
                } else {
                    dispatch(setTaskError({
                        id: taskId,
                        error: response.error || "生成备忘录失败",
                    }));
                }
            } catch (error) {
                dispatch(setTaskError({
                    id: taskId,
                    error: error instanceof Error ? error.message : "生成备忘录失败",
                }));
            }
        }
    };

    // 切换视图
    const handleViewChange = (view: "documents" | "memos") => {
        setCurrentView(view);
        if (view === "documents") {
            dispatch(setCurrentFolder(null));
        }
    };
    
    // 处理文件上传
    const handleUpload = async (files: File[]) => {
        setUploadDialogOpen(false);
        
        // 为每个文件创建上传任务
        for (const file of files) {
            const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            
            // 添加任务到任务列表
            dispatch(addTask({
                id: taskId,
                fileName: file.name,
                status: "processing",
                progress: 0,
                createdAt: new Date().toISOString(),
            }));

            try {
                // 调用上传 API
                const response = await uploadFile(file, currentFolderId || undefined);
                
                if (response.status && response.data) {
                    // 上传成功，更新任务状态
                    dispatch(updateTaskStatus({
                        id: taskId,
                        status: "completed",
                    }));
                    
                    // TODO: 刷新文件列表
                    // 这里需要调用 getDocuments API 重新获取文件列表
                } else {
                    // 上传失败
                    dispatch(setTaskError({
                        id: taskId,
                        error: response.error || "上传失败",
                    }));
                }
            } catch (error) {
                // 处理错误
                dispatch(setTaskError({
                    id: taskId,
                    error: error instanceof Error ? error.message : "上传失败",
                }));
            }
        }
    };
    
    // 任务列表会自动从 localStorage 加载（在 store 的 initialState 中）
    // 如果需要从 API 获取，可以在这里调用：
    // useEffect(() => {
    //     fetchTasksFromAPI().then(data => dispatch(setTasks(data)));
    // }, [dispatch]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            const newWidth = e.clientX;
            if (newWidth >= 200 && newWidth <= 400) {
                setLeftSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="home-new" ref={containerRef}>
            {/* 上传对话框 */}
            <UploadDialog 
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUpload={handleUpload}
            />
            
            {/* 新建文件夹对话框 */}
            <FolderDialog
                open={folderDialogOpen}
                onClose={() => setFolderDialogOpen(false)}
                onConfirm={handleFolderCreate}
            />
            
            {/* 选择文件对话框 */}
            <SelectFileDialog
                open={selectFileDialogOpen}
                onClose={() => setSelectFileDialogOpen(false)}
                onConfirm={handleCreateMemoConfirm}
            />
            
            {/* 左侧边栏 */}
            <aside className="left-sidebar" style={{ width: `${leftSidebarWidth}px` }}>
                <div className="sidebar-header">
                    <img src={appLogo} alt={appName} className="sidebar-logo" />
                    <h2 className="sidebar-title">{appName}</h2>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <h3 className="nav-section-title">我的空间</h3>
                        <ul className="nav-list">
                            <li 
                                className={`nav-item ${currentView === "documents" ? "active" : ""}`} 
                                onClick={() => handleViewChange("documents")}
                            >
                                <Folder className="nav-icon" />
                                <span>我的文档</span>
                            </li>
                            <li 
                                className={`nav-item ${currentView === "memos" ? "active" : ""}`}
                                onClick={() => handleViewChange("memos")}
                            >
                                <BookOpen className="nav-icon" />
                                <span>重点备忘</span>
                            </li>
                            <li className="nav-item">
                                <BookOpen className="nav-icon" />
                                <span>错题集</span>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <a href="#" className="footer-link">指南</a>
                    <a href="#" className="footer-link">FAQ</a>
                    <a href="#" className="footer-link">客服</a>
                </div>
            </aside>

            {/* 拖动分割线 */}
            <div 
                className={`resize-handle ${isDragging ? 'dragging' : ''}`}
                onMouseDown={() => setIsDragging(true)}
            />

            {/* 主内容区 */}
            <main className="main-content">
                {/* 文件列表区域 */}
                <div className="content-body">
                    <div className="content-top-bar">
                        <div className="breadcrumb-with-actions">
                            <div className="breadcrumb">
                                <Home className="breadcrumb-home-icon" onClick={() => navigateToFolder(null)} />
                                {breadcrumbPath.map((item, index) => (
                                    <span key={item.id || 'root'} className="breadcrumb-segment">
                                        {index > 0 && <ChevronRight className="breadcrumb-separator" />}
                                        <span 
                                            className={`breadcrumb-item ${index < breadcrumbPath.length - 1 ? 'clickable' : ''}`}
                                            onClick={() => index < breadcrumbPath.length - 1 && navigateToFolder(item.id)}
                                        >
                                            {item.name}
                                        </span>
                                    </span>
                                ))}
                            </div>
                            <div className="toolbar-actions">
                                <Button variant="outline" size="sm" onClick={handleOpenUpload}>
                                    <Upload className="h-4 w-4 mr-1" />
                                    上传课件
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleCreateFolder}>
                                    <FolderPlus className="h-4 w-4 mr-1" />
                                    新建文件夹
                                </Button>
                            </div>
                        </div>
                        <div className="top-right-actions">
                            <Button variant="outline" size="sm" onClick={handleOpenCreateMemo}>
                                <StickyNote className="h-4 w-4 mr-1" />
                                创建备忘录
                            </Button>
                            
                            <EnhancedSearch 
                                onSearch={handleSearch}
                                onDeepSearch={handleDeepSearch}
                                searchResults={searchResults}
                                isSearching={isSearching}
                            />
                            
                            <div className="task-toggle-wrapper">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="task-toggle-btn"
                                        onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                                        title="任务列表"
                                    >
                                        <ArrowLeftRight className="h-4 w-4" />
                                    </Button>
                                    
                                    {/* 悬浮任务面板 */}
                                    {rightSidebarOpen && (
                                        <div className="task-dropdown">
                                            <div className="task-dropdown-header">
                                                <h3 className="task-dropdown-title">任务列表</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="task-close-btn"
                                                    onClick={() => setRightSidebarOpen(false)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="task-dropdown-content">
                                                {tasks.length > 0 ? (
                                                    <ul className="task-list">
                                                        {tasks.map((task) => (
                                                            <li key={task.id} className="task-item-card">
                                                                <div className="task-file-info">
                                                                    <span className="task-file-name">{task.fileName}</span>
                                                                    <span className={`task-status ${task.status}`}>
                                                                        {task.status === "processing" && "处理中"}
                                                                        {task.status === "completed" && "已完成"}
                                                                        {task.status === "failed" && "处理失败"}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="task-empty">
                                                        <p>暂无任务</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            
                            {/* 用户头像菜单 */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="user-avatar-btn">
                                        <Avatar username={username} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="user-menu-card">
                                    {/* 用户信息头部 */}
                                    <div className="user-header">
                                        <Avatar username={username} className="user-avatar-large" />
                                        <div className="user-info-header">
                                            <div className="user-name-text">{username}</div>
                                            <div className="user-id-text">ID: {userId || "xxx"}</div>
                                        </div>
                                    </div>

                                    {/* 级别有效期卡片 */}
                                    <div className="subscription-card">
                                        <div className="subscription-header">
                                            <span className="subscription-label">级别</span>
                                            <span className="subscription-level">
                                                {subscription?.levelName || "体验用户"}
                                            </span>
                                        </div>
                                        <div className="subscription-expire">
                                            有效期至：{subscription?.expireTime || "--"}
                                        </div>
                                    </div>

                                    {/* 我的额度卡片 */}
                                    <div className="quota-card-menu">
                                        <div className="quota-header">
                                            <Coins className="quota-icon" />
                                            <span className="quota-title">我的额度</span>
                                        </div>
                                        <div className="quota-items">
                                            {usageRecords.slice(0, 3).map((record, index) => (
                                                <div key={index} className="quota-item-row">
                                                    <div className="quota-item-left">
                                                        <span className="quota-type">{record.type}</span>
                                                        <span className="quota-model">{record.modelName}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {usageRecords.length > 3 && (
                                                <div className="quota-more">...</div>
                                            )}
                                        </div>
                                        <div className="quota-link" onClick={handleSettings}>
                                            其他详情 →
                                        </div>
                                    </div>

                                    <DropdownMenuSeparator />

                                    {/* 菜单项 */}
                                    <DropdownMenuItem onClick={handleSettings}>
                                        <Settings className="menu-icon" />
                                        <span>设置</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="logout-item" onClick={handleLogout}>
                                        <LogOut className="menu-icon" />
                                        <span>退出</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* 内容浏览器 - 根据 currentView 切换 */}
                    {currentView === "documents" ? <FileBrowser /> : <MemoBrowser />}
                </div>
            </main>
        </div>
    );
}

export default HomeNew;

/* 
 * 任务列表使用说明（Redux Store + localStorage 持久化）：
 * 
 * === 本地操作（自动同步到 localStorage）===
 * 
 * 1. 添加新任务：
 *    dispatch(addTask({ 
 *      id: Date.now().toString(), 
 *      fileName: "new-file.pdf", 
 *      status: "processing",
 *      createdAt: new Date().toISOString()
 *    }));
 * 
 * 2. 更新任务状态：
 *    dispatch(updateTaskStatus({ id: "target-id", status: "completed" }));
 * 
 * 3. 更新任务进度：
 *    dispatch(updateTaskProgress({ id: "target-id", progress: 50 }));
 * 
 * 4. 删除任务：
 *    dispatch(removeTask("target-id"));
 * 
 * 5. 清空所有任务：
 *    dispatch(clearTasks());
 * 
 * === API 集成（可选，需要后端支持）===
 * 
 * 6. 从 API 获取任务列表并同步到 localStorage：
 *    import { fetchTasks } from "@/api/task.ts";
 *    
 *    useEffect(() => {
 *      fetchTasks().then(response => {
 *        if (response.status) {
 *          dispatch(setTasks(response.data));
 *        }
 *      });
 *    }, [dispatch]);
 * 
 * 7. 创建任务并同步到服务器：
 *    import { createTask } from "@/api/task.ts";
 *    
 *    const handleUpload = async (file: File) => {
 *      const response = await createTask(file.name, file);
 *      if (response.status) {
 *        dispatch(addTask(response.data));
 *      }
 *    };
 * 
 * 8. WebSocket 实时更新：
 *    import { createTaskWebSocket } from "@/api/task.ts";
 *    
 *    useEffect(() => {
 *      const ws = createTaskWebSocket(
 *        (updatedTask) => dispatch(updateTask(updatedTask))
 *      );
 *      return () => ws.close();
 *    }, [dispatch]);
 * 
 * === 数据查询（Selectors）===
 * 
 * 9. 获取特定状态的任务：
 *    const processingTasks = useSelector(selectProcessingTasks);
 *    const completedTasks = useSelector(selectCompletedTasks);
 *    const failedTasks = useSelector(selectFailedTasks);
 * 
 * === 数据持久化 ===
 * 
 * - 所有操作自动同步到 localStorage（key: "task_list"）
 * - 页面刷新后自动恢复任务列表
 * - 无需后端 API 即可正常工作
 * - 如需后端集成，可使用 @/api/task.ts 中的 API 函数
 */
