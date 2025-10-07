# 截图和引用功能说明

## 🎯 新增功能: 引用和笔记面板

根据手绘原型图底部右侧区域的设计，我添加了一个完整的**截图引用和笔记功能**。

### 📍 功能位置
- 触发按钮: 底部工具栏的 **"截图框"** 按钮
- 弹出位置: 屏幕右下角(底部工具栏上方)
- 面板大小: 420px 宽，最大 70vh 高

### 🎨 面板结构

```
┌─────────────────────────────────────┐
│ 引用和笔记                    [×]   │ <- 标题栏
├─────────────────────────────────────┤
│ 引用文字                            │
│ ┌─────────────────────────────────┐ │
│ │ 选中的文本内容...               │ │ <- 引用文字区域(3行)
│ └─────────────────────────────────┘ │
│                                     │
│ 用户输入内容                        │
│ ┌─────────────────────────────────┐ │
│ │ 添加您的笔记...                 │ │ <- 用户笔记区域(4行)
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [📷 从截图开始] [📤 上传图片]  │ │ <- 操作按钮
│ │ [💬 闲聊对话框]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 内容由大模型生成，原因如实说        │
│                    [取消]  [保存]   │ <- 底部操作
└─────────────────────────────────────┘
```

### ✨ 功能详解

#### 1. 引用文字区域
- **用途**: 显示从 PDF 中选中/复制的文本
- **交互**: 可编辑的多行文本框
- **占位符**: "选中的文本内容..."
- **行数**: 3 行(可调整)

#### 2. 用户输入内容区域
- **用途**: 用户添加自己的笔记和理解
- **交互**: 可编辑的多行文本框
- **占位符**: "添加您的笔记..."
- **行数**: 4 行(可调整)
- **支持**: 后续可扩展 Markdown 支持

#### 3. 操作按钮组
三个主要操作:

**📷 从截图开始**
- 启动截图工具
- 框选 PDF 区域
- 自动识别文字(OCR)
- 填充到"引用文字"区域

**📤 上传图片**
- 打开文件选择器
- 上传本地图片
- 附加到当前笔记
- 支持拖拽上传

**💬 闲聊对话框**
- 打开 AI 对话
- 基于当前引用内容提问
- 快速切换到 AI Chat 面板

#### 4. 底部提示和操作
- **AI 提示**: "内容由大模型生成，原因如实说"
- **取消按钮**: 关闭面板，不保存
- **保存按钮**: 保存引用和笔记到数据库

### 🎨 样式特点

#### 视觉设计
```less
.capture-panel {
    width: 420px;              // 宽度
    max-height: 70vh;          // 最大高度
    background: hsl(var(--card));
    border-radius: 12px;       // 大圆角
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); // 浮动阴影
}
```

#### 交互状态
- **文本框聚焦**: 主色边框 + 0.1 透明度外环阴影
- **按钮悬停**: 背景变化
- **响应式**: 小屏幕自动居中，宽度 90vw

### 📱 响应式适配

#### Desktop (>1200px)
- 固定右下角
- 宽度 420px

#### Tablet (768-1200px)
- 宽度缩减为 350px
- 保持右下角位置

#### Mobile (<768px)
- 宽度 90vw，最大 400px
- 水平居中显示
- 底部距离 10px

### 🔧 技术实现

#### 状态管理
```typescript
const [showCapturePanel, setShowCapturePanel] = useState(false);
const [captureText, setCaptureText] = useState("");
const [captureNote, setCaptureNote] = useState("");
```

#### 触发显示
```typescript
// 点击"截图框"按钮
const handleCapture = () => {
    setShowCapturePanel(true);
    // TODO: 实现截图逻辑
};
```

#### 保存操作
```typescript
const handleSaveCapture = () => {
    console.log("保存截图和笔记:", { captureText, captureNote });
    // TODO: 调用后端 API 保存
    // POST /api/document/:id/annotations
    setShowCapturePanel(false);
    setCaptureText("");
    setCaptureNote("");
};
```

### 🚀 后续集成任务

#### 1. 文本选择和引用 (高优先级)
```typescript
// 监听 PDF 文本选择
useEffect(() => {
    const handleSelection = () => {
        const selection = window.getSelection();
        const text = selection?.toString();
        if (text) {
            setCaptureText(text);
            setShowCapturePanel(true);
        }
    };
    
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
}, []);
```

#### 2. 截图工具集成 (高优先级)
```typescript
import html2canvas from 'html2canvas';

const handleScreenshot = async () => {
    // 启用选择模式
    setSelectionMode(true);
    
    // 用户框选区域
    const selectedArea = await waitForSelection();
    
    // 截图
    const canvas = await html2canvas(selectedArea);
    const imageData = canvas.toDataURL();
    
    // OCR 识别文字
    const text = await ocrService.recognize(imageData);
    setCaptureText(text);
};
```

#### 3. 图片上传 (中优先级)
```typescript
const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
    });
    
    const { url } = await response.json();
    // 插入到笔记中
    setCaptureNote(prev => `${prev}\n![图片](${url})`);
};
```

#### 4. AI 对话集成 (中优先级)
```typescript
const handleAIChat = () => {
    // 切换到 AI Chat 面板
    setActiveRightTab('chat');
    
    // 预填充问题
    const question = `关于这段引用: "${captureText}", ${captureNote}`;
    setChatInput(question);
    
    // 关闭引用面板
    setShowCapturePanel(false);
};
```

#### 5. 数据持久化 (高优先级)
```typescript
// API 接口设计
interface Annotation {
    id: string;
    documentId: string;
    pageNumber: number;
    quotedText: string;      // 引用文字
    userNote: string;        // 用户笔记
    screenshot?: string;     // 截图 URL
    createdAt: string;
}

// 保存注释
const saveAnnotation = async () => {
    const annotation: Annotation = {
        documentId: docId,
        pageNumber: currentPage,
        quotedText: captureText,
        userNote: captureNote,
        screenshot: screenshotUrl,
        createdAt: new Date().toISOString()
    };
    
    await fetch(`/api/document/${docId}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annotation)
    });
};
```

### 💡 使用场景

#### 场景 1: 快速引用
1. 在 PDF 中选中一段文字
2. 自动弹出引用面板，文字已填充
3. 添加个人理解到"用户输入内容"
4. 点击"保存"

#### 场景 2: 截图笔记
1. 点击底部"截图框"按钮
2. 框选 PDF 中的图表或公式
3. OCR 自动识别文字
4. 添加笔记说明
5. 保存到知识库

#### 场景 3: 上传配图
1. 打开引用面板
2. 点击"上传图片"
3. 选择手绘笔记照片
4. 添加文字说明
5. 保存为复合笔记

#### 场景 4: AI 辅助理解
1. 引用一段难懂的文字
2. 添加"不理解这段话"笔记
3. 点击"闲聊对话框"
4. 自动跳转到 AI Chat
5. AI 解释引用内容

### 🎯 与手绘图对比

#### 手绘图要求 ✅
- ✅ 引用选区区域
- ✅ 引用这段文字(文本框)
- ✅ 闲聊对话框(蓝色标注)
- ✅ 添加编辑内容
- ✅ 用户输入内容
- ✅ 从截图开始
- ✅ 内容由大模型生成，原因如实说

#### 实现效果 ✅
- ✅ 完整的引用和笔记面板
- ✅ 两个文本输入区域
- ✅ 三个操作按钮(截图/上传/对话)
- ✅ AI 生成提示
- ✅ 保存和取消按钮
- ✅ 响应式布局
- ✅ 主题适配

### 📊 数据流程

```
用户操作
    ↓
1. 选中文字 / 点击截图框
    ↓
2. 显示引用面板
    ↓
3. 填充引用文字(自动)
    ↓
4. 用户添加笔记
    ↓
5. 可选: 上传图片 / AI对话
    ↓
6. 点击保存
    ↓
7. POST /api/document/:id/annotations
    ↓
8. 数据存储到数据库
    ↓
9. 关联到当前页面
    ↓
10. 后续可在侧边栏查看所有注释
```

### 🎨 视觉预览

```
当前页面布局:
┌─────────────────────────────────────────────────────────┐
│ Logo  路径         AI Chat  Memo  Quiz       ↻  ×      │
├──────┬─────────────────────────────────────┬────────────┤
│缩略图│                                     │            │
│      │                                     │            │
│面包屑│          PDF 内容区                 │  右侧功能  │
│      │                                     │            │
│叶签页│                                     │            │
├──────┴─────────────────────────────────────┴─────┬──────┤
│  [◄] [1/10] [►]  [−] 100% [+]  [截图框] [书签]  │ 引用 │
└──────────────────────────────────────────────────┤ 和   │
                                                   │ 笔记 │
                                                   │ 面板 │
                                                   └──────┘
```

---

**功能状态**: ✅ UI 完成，等待功能集成  
**优先级**: 高 - 核心学习功能  
**依赖**: OCR 服务、图片上传、数据库存储  
**更新时间**: 2025/10/06
