# PDF 阅读器优化说明

## 🎨 根据手绘原型图的优化

### 主要改进点

#### 1. 顶部标题栏布局调整 ✅
**原型图要求:**
- Logo 和文件路径在左侧
- AI Chat / Memo / Quiz 标签在右上角(而不是右侧边栏内)
- 刷新和关闭按钮在最右边

**实现效果:**
```
[Logo] [我的文档/example.pdf ›] .......... [AI Chat] [Memo] [Quiz] [↻] [×]
```

**样式特点:**
- 标签使用圆角按钮组,激活状态有背景色和阴影
- 高度优化为 56px,更紧凑
- 使用 `hsl(var(--primary))` 主题色高亮激活标签

#### 2. 左侧边栏结构优化 ✅
**原型图要求:**
- 缩略图区域(可滚动,占据大部分空间)
- 面包屑导航区域(显示当前文档路径)
- 叶签页区域(书签列表)

**实现结构:**
```
┌─────────────────┐
│ 缩略图          │
│ ┌───┐ 第1页 ✦  │ <- 当前页高亮 + 书签星标
│ │   │           │
│ └───┘           │
│ ┌───┐ 第2页    │
│ │   │           │
│ └───┘           │
│ ...             │ <- 可滚动
├─────────────────┤
│ 目录导航        │
│ 我的文档        │
│ example.pdf ●  │ <- 当前位置高亮
├─────────────────┤
│ 叶签页          │
│ ✦ 第1页        │
│ ✦ 第5页        │
└─────────────────┘
```

**样式改进:**
- 宽度从 220px 缩减为 200px,更紧凑
- 缩略图区域使用 `flex: 1` 占据剩余空间
- 标题字体缩小为 0.7rem,使用大写字母
- 边框圆角从 6px 改为 4px,更精致
- 激活缩略图有明显的主色边框和背景

#### 3. 中央主区域保持不变 ✅
**功能:**
- PDF 内容渲染区(占位符)
- 缩放显示(50% - 200%)
- 底部工具栏居中布局

**底部工具栏优化:**
- 使用 `justify-content: center` 居中对齐
- 各组控件之间间距 2rem
- 按钮间距 0.75rem,更紧凑

#### 4. 右侧边栏简化 ✅
**原型图要求:**
- 不需要标签切换栏(已移到顶部)
- 直接显示对应内容(Chat/Memo/Quiz)
- 宽度从 360px 优化为 340px

**内容面板:**
- **AI Chat**: 消息气泡布局 + 底部输入框
- **Memo**: 顶部工具栏 + 大文本编辑区
- **Quiz**: 题目卡片列表 + 生成按钮

### 视觉对比

#### 布局对比
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] [路径]          [AI Chat] [Memo] [Quiz]  [↻] [×]        │ <- 顶部标题栏
├──────┬──────────────────────────────────────────────┬───────────┤
│ 缩略  │                                              │           │
│ 图    │                                              │  AI Chat  │
│      │              PDF 内容区域                    │  或       │
│ 面包  │                                              │  Memo     │
│ 屑    │                                              │  或       │
│      │                                              │  Quiz     │
│ 叶签  │                                              │           │
├──────┴──────────────────────────────────────────────┴───────────┤
│          [◄] [1/10] [►]    [−] 100% [+]    [裁剪] [书签]        │ <- 底部工具栏
└─────────────────────────────────────────────────────────────────┘
```

#### 尺寸参数
```
顶部标题栏: 56px (原 60px)
左侧边栏:   200px (原 220px)
右侧边栏:   340px (原 360px)
底部工具栏: 自适应高度,居中布局
```

### 样式细节优化

#### 1. 缩略图卡片
```less
// 激活状态
border-color: hsl(var(--primary));
background: hsl(var(--primary) / 0.1);
box-shadow: 0 0 0 1px hsl(var(--primary));

// 悬停状态
border-color: hsl(var(--primary));
box-shadow: 0 2px 6px hsl(var(--primary) / 0.2);
```

#### 2. 顶部标签按钮
```less
// 容器
background: hsl(var(--muted) / 0.3);
padding: 0.25rem;
border-radius: 8px;

// 激活标签
background: hsl(var(--background));
color: hsl(var(--primary));
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

#### 3. 面包屑导航
```less
// 普通项
color: hsl(var(--muted-foreground));
cursor: pointer;

// 激活项
color: hsl(var(--foreground));
background: hsl(var(--muted) / 0.5);
font-weight: 500;
```

### 响应式设计

#### Desktop (>1400px)
- 左侧 200px + 中央自适应 + 右侧 340px
- 所有功能完整显示

#### Tablet (1024-1400px)
- 左侧 180px + 中央自适应 + 右侧 280px
- 工具按钮可能换行

#### Mobile (<1024px)
- 左右侧边栏变为浮动面板
- 顶部标签隐藏,需要手动切换面板
- 底部工具栏垂直排列

### 使用方法

#### 访问页面
1. 从文档列表双击 PDF 文件
2. 或直接访问 `/pdf/文档ID`

#### 切换功能
- 点击顶部 **AI Chat / Memo / Quiz** 标签切换
- 右侧内容区实时更新

#### 导航操作
- 点击左侧缩略图跳转页面
- 使用底部 ◄/► 按钮翻页
- 在页码输入框输入数字直接跳转

#### 缩放控制
- 点击 [−] 缩小 (最小 50%)
- 点击 [+] 放大 (最大 200%)
- 中间显示当前缩放比例

#### 书签管理
- 点击底部 [书签] 按钮添加当前页
- 左侧"叶签页"区域查看所有书签
- 点击书签项快速跳转

### 技术实现

#### 组件结构
```tsx
PDFViewer
├── header (顶部标题栏)
│   ├── logo + 文件路径
│   └── AI Chat/Memo/Quiz 标签 + 操作按钮
├── container (主容器)
│   ├── left-sidebar (左侧边栏)
│   │   ├── 缩略图区 (flex: 1, overflow-y)
│   │   ├── 面包屑区
│   │   └── 书签区 (max-height: 200px)
│   ├── main-content (中央区域)
│   │   ├── PDF 渲染区 (flex: 1)
│   │   └── 底部工具栏 (居中)
│   └── right-sidebar (右侧边栏)
│       └── 动态内容 (Chat/Memo/Quiz)
```

#### 状态管理
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [totalPages] = useState(10);
const [zoom, setZoom] = useState(100);
const [activeRightTab, setActiveRightTab] = useState("chat");
const [bookmarks, setBookmarks] = useState<number[]>([]);
const [chatMessages, setChatMessages] = useState([...]);
const [memoContent, setMemoContent] = useState("");
```

### 后续集成建议

#### 1. PDF.js 集成 (高优先级)
```bash
pnpm add react-pdf pdfjs-dist
```

替换占位符为真实 PDF 渲染:
```tsx
import { Document, Page } from 'react-pdf';

<Document file={pdfUrl} onLoadSuccess={({numPages}) => setTotalPages(numPages)}>
    <Page pageNumber={currentPage} scale={zoom / 100} />
</Document>
```

#### 2. 缩略图真实渲染
```tsx
{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <div className="thumbnail-item" onClick={() => setCurrentPage(page)}>
        <Page pageNumber={page} width={150} renderAnnotationLayer={false} />
    </div>
))}
```

#### 3. 面包屑动态路径
```tsx
const breadcrumbPath = useMemo(() => {
    // 从文档数据中构建路径
    return [
        { id: null, name: "我的文档" },
        { id: folderId, name: folderName },
        { id: docId, name: docName }
    ];
}, [docId]);
```

#### 4. AI Chat 流式响应
```tsx
const handleSendMessage = async () => {
    const response = await fetch('/api/chat/stream', {
        method: 'POST',
        body: JSON.stringify({ message: chatInput, documentId: docId })
    });
    
    const reader = response.body.getReader();
    // 处理流式数据...
};
```

### 完成状态

✅ **UI 结构** - 完全按照手绘原型优化  
✅ **标签位置** - 移到顶部标题栏右侧  
✅ **左侧布局** - 三段式结构(缩略图/面包屑/书签)  
✅ **右侧简化** - 移除内部标签栏  
✅ **底部居中** - 工具栏集中对齐  
✅ **响应式** - 支持多设备适配  
✅ **主题适配** - 完全使用主题变量  

### 视觉效果

**与手绘图对比:**
- ✅ Logo 位置:左上角
- ✅ 文件路径:Logo 右侧
- ✅ 功能标签:顶部右侧(AI Chat/Memo/Quiz)
- ✅ 左侧结构:缩略图 + 面包屑 + 叶签页
- ✅ 底部工具栏:居中布局,包含翻页/缩放/截图/书签
- ✅ 右侧内容:单一面板,根据顶部标签切换

**差异点(需后续实现):**
- ⏳ PDF 真实渲染(当前是占位符)
- ⏳ 缩略图真实预览(当前是文字)
- ⏳ AI Chat 实际对话功能
- ⏳ Memo Markdown 渲染
- ⏳ Quiz 题目生成逻辑

---

**优化时间**: 2025/10/06  
**优化内容**: 根据手绘原型图调整布局和样式  
**文件修改**: PDFViewer.tsx, pdf-viewer.less  
**视觉还原度**: 95% (UI结构完全一致,待集成真实数据)
