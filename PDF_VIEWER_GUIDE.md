# PDF 阅读器页面使用说明

## 📄 功能概览

这是一个完整的 PDF 文档阅读和学习页面,集成了 Chanio(文档解析)和 QuizNote(笔记/测验)的功能。

## 🎯 核心功能

### 1. 左侧边栏 - 导航和书签
- **缩略图列表**: 显示所有页面的缩略图,点击跳转到对应页面
- **书签管理**: 显示已添加的书签页面,快速导航
- **当前页高亮**: 当前浏览的页面在缩略图中会高亮显示

### 2. 中央主区域 - PDF 阅读
- **PDF 内容渲染**: 
  - 当前显示占位符,需要集成 `react-pdf` 或 `pdf.js` 库
  - 支持缩放(50% - 200%)
  - 支持页面导航(上一页/下一页)
- **底部工具栏**:
  - 页面导航按钮
  - 页码输入框(直接跳转)
  - 缩放控制(放大/缩小)
  - 裁剪区域功能
  - 添加书签功能

### 3. 右侧边栏 - AI 辅助学习
包含三个标签页:

#### AI Chat - 智能问答
- 基于文档内容的 AI 对话
- 可以问文档相关问题
- 消息历史记录
- 支持 Enter 键发送

#### Memo - 文档笔记
- Markdown 格式笔记编辑
- 自动保存功能(需要后端集成)
- 支持导出为 PDF/DOCX

#### Quiz - 测验题目
- 自动生成测验题目
- 支持多种题型:
  - 单选题
  - 判断题
  - 填空题
  - 简答题
- 答案检查和评分

## 🚀 如何访问

### 方式 1: 从文档列表双击打开
在 HomeNew 页面的文档列表中,双击任何 PDF/DOC/DOCX 文件,会自动跳转到 PDF 阅读器页面。

```typescript
// FileBrowser.tsx 中已实现
const handleDoubleClick = (doc: DocumentInfo) => {
    if (doc.type === "folder") {
        dispatch(setCurrentFolder(doc.id));
    } else {
        const ext = doc.fileType?.toLowerCase();
        if (ext === "pdf" || ext === "doc" || ext === "docx") {
            navigate(`/pdf/${doc.id}`); // 跳转到 PDF 阅读器
        }
    }
};
```

### 方式 2: 直接访问 URL
访问 `/pdf/:id` 路由,例如:
- `http://localhost:5173/pdf/123`
- `http://localhost:5173/pdf/example-document`

## 📁 文件结构

```
src/
├── routes/
│   └── PDFViewer.tsx          # PDF 阅读器主组件 (370+ 行)
├── assets/
│   └── pages/
│       └── pdf-viewer.less    # PDF 阅读器样式 (480+ 行)
└── router.tsx                  # 添加了 /pdf/:id 路由
```

## 🎨 样式特点

### 响应式设计
- **Desktop (>1400px)**: 左侧 220px + 中间自适应 + 右侧 360px
- **Tablet (1024-1400px)**: 左侧 180px + 右侧 320px
- **Mobile (<1024px)**: 侧边栏变为可切换的浮动面板

### 主题适配
使用 CSS 自定义属性,完全适配主题:
- `hsl(var(--primary))` - 主色调
- `hsl(var(--foreground))` - 前景色
- `hsl(var(--background))` - 背景色
- `hsl(var(--card))` - 卡片背景
- `hsl(var(--border))` - 边框颜色

### 交互效果
- 缩略图悬停高亮
- 当前页面带边框和背景
- 标签切换带下划线动画
- 按钮悬停带阴影效果

## 🔧 后续集成任务

### 高优先级
1. **PDF.js 集成** - 真实 PDF 渲染
   ```bash
   pnpm add pdfjs-dist react-pdf
   ```

2. **AI Chat API** - 连接后端 AI 服务
   ```typescript
   // POST /api/chat/message
   interface ChatRequest {
     documentId: string;
     message: string;
     context: string; // PDF 内容上下文
   }
   ```

3. **Memo 自动保存** - 笔记持久化
   ```typescript
   // PUT /api/memo/:documentId
   interface MemoUpdate {
     content: string;
     lastModified: string;
   }
   ```

4. **Quiz 生成器** - AI 生成测验题
   ```typescript
   // POST /api/quiz/generate
   interface QuizGenerateRequest {
     documentId: string;
     pageRange?: [number, number];
     questionTypes: ("multiple" | "truefalse" | "fillblank" | "shortanswer")[];
     count: number;
   }
   ```

### 中优先级
5. **文档加载和缓存** - 从后端获取真实 PDF
6. **书签持久化** - 保存用户书签
7. **导出功能** - 导出笔记和测验为 PDF/Word
8. **权限控制** - 根据会员等级限制功能

### 低优先级
9. **文本选择和标注** - 高亮、下划线、批注
10. **多文档对比** - 并排查看多个 PDF
11. **语音朗读** - TTS 朗读文档内容

## 🧪 测试方法

### 1. 启动开发服务器
```bash
cd c:\Users\cookies\Desktop\react\quizonly
pnpm dev
```

### 2. 访问主页
浏览器打开 `http://localhost:5173`

### 3. 登录系统
使用测试账号(如果有自动登录则跳过)

### 4. 测试 PDF 阅读器
**方法 A**: 从文档列表进入
- 进入"我的文档"
- 双击任何 PDF 文件

**方法 B**: 直接访问
- 浏览器访问 `http://localhost:5173/pdf/test-doc-id`

### 5. 测试功能
- ✅ 点击缩略图跳转页面
- ✅ 使用页面导航按钮
- ✅ 在页码输入框输入数字跳转
- ✅ 点击缩放按钮调整显示比例
- ✅ 点击"添加书签"按钮
- ✅ 切换右侧标签(AI Chat/Memo/Quiz)
- ✅ 在 Chat 中发送消息
- ✅ 在 Memo 中输入笔记
- ✅ 查看 Quiz 问题
- ✅ 点击右上角关闭按钮返回

## 💡 开发提示

### 集成 react-pdf 示例
```typescript
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// 在组件中使用
<Document 
    file={pdfUrl} 
    onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
>
    <Page 
        pageNumber={currentPage} 
        scale={zoom / 100}
    />
</Document>
```

### 会员权限检查
```typescript
import { useSelector } from "react-redux";
import { selectMembershipLevel } from "@/store/auth.ts";

function PDFViewer() {
    const membershipLevel = useSelector(selectMembershipLevel);
    
    const canUseAIChat = membershipLevel !== "trial";
    const canGenerateQuiz = ["semester", "yearly"].includes(membershipLevel || "");
    
    // 在 UI 中使用
    {!canUseAIChat && (
        <div className="upgrade-prompt">
            升级会员以使用 AI Chat 功能
        </div>
    )}
}
```

## 📊 数据结构参考

### Document Info (文档信息)
```typescript
interface DocumentInfo {
    id: string;
    name: string;
    type: "file" | "folder";
    fileType?: "pdf" | "doc" | "docx" | "xls" | "xlsx" | "jpg" | "png";
    size?: number;
    createdAt: string;
    parentId: string | null;
}
```

### Chat Message (聊天消息)
```typescript
interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
}
```

### Quiz Question (测验问题)
```typescript
interface QuizQuestion {
    id: string;
    question: string;
    type: "multiple" | "truefalse" | "fillblank" | "shortanswer";
    options?: string[]; // 仅用于选择题
    answer: number | string; // 正确答案索引或内容
    explanation?: string; // 答案解析
}
```

## 🎉 完成状态

✅ **UI 完整实现** - 所有界面元素已创建  
✅ **路由集成** - `/pdf/:id` 路由已配置  
✅ **导航功能** - 从文档列表双击打开  
✅ **响应式设计** - 支持桌面/平板/移动端  
✅ **主题适配** - 完全使用主题变量  
⏳ **PDF 渲染** - 需要集成 PDF.js  
⏳ **AI 功能** - 需要后端 API  
⏳ **数据持久化** - 需要数据库支持  

## 📞 下一步建议

1. **立即可测试**: 运行 `pnpm dev` 查看 UI 效果
2. **快速集成**: 安装 `react-pdf` 实现真实 PDF 渲染
3. **后端开发**: 根据上述 API 设计实现后端服务
4. **功能完善**: 逐步添加 AI Chat、Quiz 生成等高级功能

---

**项目**: Chanio + QuizNote 融合版  
**页面**: PDF 阅读和学习界面  
**状态**: UI 完成,等待功能集成  
**创建时间**: 2025/10/06
