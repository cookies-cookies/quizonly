import { useState, useRef, useEffect } from "react";
import { Search, X, Clock, Sparkles, FileText, Folder } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import "@/assets/components/enhanced-search.less";

interface SearchHistoryItem {
    id: string;
    query: string;
    timestamp: Date;
}

interface SearchResult {
    id: string;
    name: string;
    type: "file" | "folder";
    path: string;
    excerpt?: string;
}

interface EnhancedSearchProps {
    onSearch?: (query: string) => void;
    onDeepSearch?: (query: string) => void;
    searchResults?: SearchResult[];
    isSearching?: boolean;
}

export default function EnhancedSearch({ onSearch, onDeepSearch, searchResults = [], isSearching = false }: EnhancedSearchProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [deepSearchQuery, setDeepSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState("accurate");
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchFocus = () => {
        setIsExpanded(true);
    };

    const handleAccurateSearch = () => {
        if (searchQuery.trim()) {
            const newHistoryItem: SearchHistoryItem = {
                id: Date.now().toString(),
                query: searchQuery,
                timestamp: new Date()
            };
            setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 4)]);
            setShowResults(true);
            onSearch?.(searchQuery);
        }
    };

    const handleDeepSearchSubmit = () => {
        if (deepSearchQuery.trim()) {
            onDeepSearch?.(deepSearchQuery);
        }
    };

    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        setShowResults(true);
        onSearch?.(query);
    };

    const clearHistory = () => {
        setSearchHistory([]);
    };

    return (
        <div ref={searchRef} className={`enhanced-search ${isExpanded ? "expanded" : ""}`}>
            {/* 顶部搜索框 */}
            <div className="search-box">
                <Search className="search-icon" />
                <Input
                    type="text"
                    placeholder="输入关键词检索..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && activeTab === "accurate") {
                            handleAccurateSearch();
                        }
                    }}
                />
                {searchQuery && (
                    <button className="clear-btn" onClick={() => setSearchQuery("")}>
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* 展开的搜索面板 */}
            {isExpanded && (
                <div className="search-dropdown">
                    <div className="search-panel-layout">
                        {/* 左侧：精准匹配/深度检索 */}
                        <div className="search-left-panel">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="search-tabs">
                                <TabsList className="tabs-list">
                                    <TabsTrigger value="accurate" className="tab-trigger">
                                        精准匹配
                                    </TabsTrigger>
                                    <TabsTrigger value="deep" className="tab-trigger">
                                        深度检索
                                    </TabsTrigger>
                                </TabsList>

                                {/* 精准匹配 - 搜索历史 */}
                                <TabsContent value="accurate" className="tab-content">
                                    {showResults ? (
                                        <div className="search-results-section">
                                            <div className="results-header">
                                                <h3>
                                                    <Search size={16} />
                                                    <span>搜索结果</span>
                                                </h3>
                                                <button 
                                                    className="back-to-history-btn" 
                                                    onClick={() => setShowResults(false)}
                                                >
                                                    返回历史
                                                </button>
                                            </div>
                                            <div className="results-list">
                                                {isSearching ? (
                                                    <div className="searching-state">
                                                        <div className="spinner"></div>
                                                        <p>搜索中...</p>
                                                    </div>
                                                ) : searchResults.length === 0 ? (
                                                    <div className="empty-results">
                                                        <p>未找到相关内容</p>
                                                        <span className="hint-text">试试其他关键词</span>
                                                    </div>
                                                ) : (
                                                    searchResults.map((result) => (
                                                        <div key={result.id} className="result-item">
                                                            {result.type === "folder" ? (
                                                                <Folder size={16} className="result-icon folder" />
                                                            ) : (
                                                                <FileText size={16} className="result-icon file" />
                                                            )}
                                                            <div className="result-content">
                                                                <div className="result-name">{result.name}</div>
                                                                <div className="result-path">{result.path}</div>
                                                                {result.excerpt && (
                                                                    <div className="result-excerpt">{result.excerpt}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="search-history-section">
                                        <div className="history-header">
                                            <h3>
                                                <Clock size={16} />
                                                <span>搜索历史</span>
                                            </h3>
                                            {searchHistory.length > 0 && (
                                                <button className="clear-history-btn" onClick={clearHistory}>
                                                    清除
                                                </button>
                                            )}
                                        </div>
                                        <div className="history-list">
                                            {searchHistory.length === 0 ? (
                                                <div className="empty-history">
                                                    <p>暂无搜索历史</p>
                                                    <span className="hint-text">输入关键词检索...</span>
                                                </div>
                                            ) : (
                                                searchHistory.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="history-item"
                                                        onClick={() => handleHistoryClick(item.query)}
                                                    >
                                                        <Search size={14} />
                                                        <span className="history-query">{item.query}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    )}
                                </TabsContent>

                                {/* 深度检索 - 输入框 */}
                                <TabsContent value="deep" className="tab-content">
                                    <div className="deep-search-section">
                                        <div className="deep-search-label">
                                            <Sparkles size={16} />
                                            <span>输入问题进行深度搜索</span>
                                        </div>
                                        <textarea
                                            placeholder="对映5句回x..."
                                            className="deep-search-textarea"
                                            value={deepSearchQuery}
                                            onChange={(e) => setDeepSearchQuery(e.target.value)}
                                            rows={6}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* 右侧：使用指南 */}
                        <div className="search-right-panel">
                            <div className="usage-guide">
                                <div className="guide-header">
                                    <FileText size={16} />
                                    <span>使用指南</span>
                                </div>
                                <div className="guide-content">
                                    <div className="guide-item">
                                        <div className="guide-icon accurate">✓</div>
                                        <div className="guide-text">
                                            <strong>精准正确</strong>
                                            <p>基于关键词精准匹配文档</p>
                                        </div>
                                    </div>
                                    <div className="guide-item">
                                        <div className="guide-icon deep">✓</div>
                                        <div className="guide-text">
                                            <strong>深度准确</strong>
                                            <p>AI深度理解,智能匹配核心内容</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 底部搜索按钮 */}
                    <div className="search-footer">
                        {activeTab === "accurate" ? (
                            <Button 
                                onClick={handleAccurateSearch}
                                disabled={!searchQuery.trim()}
                                className="search-submit-btn"
                            >
                                搜索
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleDeepSearchSubmit}
                                disabled={!deepSearchQuery.trim()}
                                className="search-submit-btn deep"
                            >
                                开始深度搜索
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
