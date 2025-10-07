// Mock API for memo management - uses localStorage to simulate backend

const MEMO_STORAGE_KEY = "quizonly_memos";

// 备忘录类型
export interface MemoInfo {
  id: string;
  title: string;
  sourceFileId: string;
  sourceFileName: string;
  content: string; // AI 生成的总结内容（Markdown 格式）
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

// API 响应类型
export interface MemoResponse {
  status: boolean;
  data?: MemoInfo;
  error?: string;
}

export interface MemoListResponse {
  status: boolean;
  data?: MemoInfo[];
  error?: string;
}

// 从 localStorage 获取所有备忘录
function getStoredMemos(): MemoInfo[] {
  const stored = localStorage.getItem(MEMO_STORAGE_KEY);
  if (!stored) {
    return [];
  }
  return JSON.parse(stored);
}

// 保存备忘录到 localStorage
function saveMemos(memos: MemoInfo[]): void {
  localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos));
}

// 生成唯一 ID
function generateId(): string {
  return `memo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Mock AI 生成内容
function generateMockMemoContent(fileName: string): string {
  // 根据文件类型生成不同的模拟内容
  const fileExt = fileName.split('.').pop()?.toLowerCase();
  
  if (fileExt === 'pdf') {
    return `# ${fileName} - 重点总结

## 📌 核心要点

1. **主要概念**
   - 本文档介绍了关键的理论框架和实践方法
   - 包含多个重要的定义和公式
   - 提供了丰富的示例和应用场景

2. **重点内容**
   - 第一章：基础概念介绍
   - 第二章：核心理论详解
   - 第三章：实践应用案例

## 💡 关键知识点

### 知识点 1：基础理论
这是文档中的第一个重要概念，需要重点理解和记忆。主要包括以下几个方面：
- 定义和基本性质
- 应用场景分析
- 常见问题解答

### 知识点 2：实践方法
文档提供了系统的实践指导，包括：
- 步骤详解
- 注意事项
- 最佳实践建议

## 📝 重要公式/定理

\`\`\`
公式 1: E = mc²
公式 2: F = ma
\`\`\`

## ✅ 学习建议

1. 先理解基础概念，再深入学习高级内容
2. 多做练习题，巩固理论知识
3. 结合实际案例，加深理解
4. 定期复习，形成知识体系

---
*此总结由 AI 自动生成，建议结合原文档学习*`;
  }
  
  if (fileExt === 'docx' || fileExt === 'doc') {
    return `# ${fileName} - 学习笔记

## 📚 文档概览

本文档是一份详细的学习资料，涵盖了重要的知识点和实践经验。

## 🎯 核心内容

### 第一部分：理论基础
- **概念定义**：清晰地阐述了核心概念
- **理论框架**：建立了完整的知识体系
- **逻辑关系**：梳理了各部分之间的联系

### 第二部分：实践应用
- **案例分析**：通过具体案例说明理论应用
- **操作步骤**：详细的实践指导
- **经验总结**：提炼的最佳实践

## 💎 重点摘录

> "这是文档中的一段重要引用，需要特别注意和理解。"

关键要点：
1. 要点一：需要深入理解的概念
2. 要点二：实践中的关键技巧
3. 要点三：容易混淆的知识点

## 📊 知识结构图

\`\`\`
主题
├── 子主题 1
│   ├── 细节 A
│   └── 细节 B
├── 子主题 2
│   ├── 细节 C
│   └── 细节 D
└── 子主题 3
\`\`\`

## 🔍 延伸学习

建议进一步学习的相关主题：
- 主题 A：深化理论理解
- 主题 B：拓展应用场景
- 主题 C：前沿研究方向

---
*AI 生成摘要 · 仅供参考*`;
  }
  
  if (fileExt === 'xlsx' || fileExt === 'xls') {
    return `# ${fileName} - 数据分析总结

## 📊 数据概览

本表格包含了重要的数据信息和统计结果。

## 🔢 关键数据

### 主要指标
- **总记录数**：约 500 条
- **数据维度**：8 个主要字段
- **时间范围**：2024 年全年

### 统计结果
| 指标 | 数值 | 趋势 |
|------|------|------|
| 平均值 | 85.6 | ↗️ 上升 |
| 最大值 | 98.5 | - |
| 最小值 | 62.3 | - |

## 📈 趋势分析

1. **增长趋势**：整体呈现稳定增长态势
2. **波动情况**：季度间存在一定波动
3. **异常值**：已识别并标注特殊数据点

## 💡 洞察发现

- 发现 1：某项指标显著高于预期
- 发现 2：存在季节性变化规律
- 发现 3：不同组别间差异明显

## 🎯 行动建议

基于数据分析结果，建议：
1. 继续保持当前策略
2. 关注异常数据的原因
3. 优化特定环节的表现

---
*数据分析由 AI 自动生成*`;
  }
  
  // 默认通用总结
  return `# ${fileName} - 文档总结

## 📄 内容概要

这是一份重要的学习资料，包含了核心知识点和关键信息。

## 🎯 重点内容

1. **主要观点**
   - 文档阐述了重要的理论和实践内容
   - 提供了系统化的知识框架
   - 包含丰富的示例和应用

2. **关键信息**
   - 核心概念清晰明确
   - 逻辑结构完整
   - 实用价值高

## 💡 学习要点

- ✅ 理解核心概念
- ✅ 掌握关键方法
- ✅ 应用实践经验
- ✅ 形成知识体系

## 📝 复习建议

建议定期回顾此总结，结合原文档加深理解。

---
*此摘要由 AI 生成，仅供学习参考*`;
}

// Mock: 获取所有备忘录
export async function getMemos(): Promise<MemoListResponse> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const memos = getStoredMemos();
    return { status: true, data: memos };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// Mock: 创建备忘录（AI 生成）
export async function createMemo(fileId: string, fileName: string): Promise<MemoResponse> {
  // 模拟 AI 处理延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const memos = getStoredMemos();
    
    // 生成 AI 内容
    const content = generateMockMemoContent(fileName);
    
    const newMemo: MemoInfo = {
      id: generateId(),
      title: `${fileName} 的学习总结`,
      sourceFileId: fileId,
      sourceFileName: fileName,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    memos.push(newMemo);
    saveMemos(memos);
    
    return { status: true, data: newMemo };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// Mock: 获取单个备忘录
export async function getMemo(id: string): Promise<MemoResponse> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const memos = getStoredMemos();
    const memo = memos.find(m => m.id === id);
    
    if (!memo) {
      return { status: false, error: "备忘录不存在" };
    }
    
    return { status: true, data: memo };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}

// Mock: 删除备忘录
export async function deleteMemo(id: string): Promise<MemoResponse> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const memos = getStoredMemos();
    const index = memos.findIndex(m => m.id === id);
    
    if (index === -1) {
      return { status: false, error: "备忘录不存在" };
    }
    
    const deletedMemo = memos[index];
    memos.splice(index, 1);
    saveMemos(memos);
    
    return { status: true, data: deletedMemo };
  } catch (e) {
    return { status: false, error: (e as Error).message };
  }
}
