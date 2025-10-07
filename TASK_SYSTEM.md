# 任务管理系统使用文档

## 📋 概述

任务管理系统采用 **Redux Store + localStorage** 的混合架构：
- ✅ **Redux Store**: 管理运行时状态，支持全局访问
- ✅ **localStorage**: 自动持久化，刷新页面不丢失
- ✅ **可选 API**: 预留后端接口，支持服务器同步
- ✅ **TypeScript**: 完整类型支持

---

## 🎯 快速开始

### 1. 在组件中使用任务列表

```tsx
import { useSelector, useDispatch } from "react-redux";
import { selectTasks, addTask } from "@/store/task.ts";

function MyComponent() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          {task.fileName} - {task.status}
        </div>
      ))}
    </div>
  );
}
```

### 2. 添加新任务

```tsx
import { addNewTask } from "@/utils/task.ts";

// 简单方式（推荐）
const taskId = addNewTask(dispatch, "document.pdf", "processing");

// 完整方式
dispatch(addTask({
  id: Date.now().toString(),
  fileName: "document.pdf",
  status: "processing",
  createdAt: new Date().toISOString(),
  progress: 0
}));
```

### 3. 文件上传示例

```tsx
import { simulateFileUpload } from "@/utils/task.ts";

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  
  // 自动创建任务并模拟上传进度
  const taskId = await simulateFileUpload(dispatch, file);
  console.log("上传完成，任务ID:", taskId);
};

<input type="file" onChange={handleFileUpload} />
```

---

## 📦 Redux Actions

### addTask
添加单个任务
```tsx
dispatch(addTask({
  id: "unique-id",
  fileName: "test.pdf",
  status: "processing"
}));
```

### addTasks
批量添加任务
```tsx
dispatch(addTasks([task1, task2, task3]));
```

### updateTaskStatus
更新任务状态
```tsx
dispatch(updateTaskStatus({ 
  id: "task-id", 
  status: "completed" 
}));
```

### updateTaskProgress
更新任务进度（0-100）
```tsx
dispatch(updateTaskProgress({ 
  id: "task-id", 
  progress: 50 
}));
```

### updateTask
更新整个任务对象
```tsx
dispatch(updateTask({
  id: "task-id",
  fileName: "updated.pdf",
  status: "completed",
  progress: 100
}));
```

### removeTask
删除单个任务
```tsx
dispatch(removeTask("task-id"));
```

### clearTasks
清空所有任务
```tsx
dispatch(clearTasks());
```

### setTasks
设置整个任务列表（从 API 获取时使用）
```tsx
dispatch(setTasks([task1, task2, task3]));
```

### setTaskError
设置任务错误信息
```tsx
dispatch(setTaskError({ 
  id: "task-id", 
  error: "上传失败：网络错误" 
}));
```

---

## 🔍 Selectors

### selectTasks
获取所有任务
```tsx
const tasks = useSelector(selectTasks);
```

### selectTaskById
根据 ID 获取任务
```tsx
const task = useSelector((state) => selectTaskById(state, "task-id"));
```

### selectProcessingTasks
获取处理中的任务
```tsx
const processingTasks = useSelector(selectProcessingTasks);
```

### selectCompletedTasks
获取已完成的任务
```tsx
const completedTasks = useSelector(selectCompletedTasks);
```

### selectFailedTasks
获取失败的任务
```tsx
const failedTasks = useSelector(selectFailedTasks);
```

---

## 🌐 API 集成（可选）

如果后端已实现 API，可以使用 `@/api/task.ts` 中的函数：

### 获取任务列表
```tsx
import { fetchTasks } from "@/api/task.ts";

useEffect(() => {
  fetchTasks().then(response => {
    if (response.status) {
      dispatch(setTasks(response.data));
    }
  });
}, [dispatch]);
```

### 创建任务
```tsx
import { createTask } from "@/api/task.ts";

const handleUpload = async (file: File) => {
  const response = await createTask(file.name, file);
  if (response.status) {
    dispatch(addTask(response.data));
  }
};
```

### WebSocket 实时更新
```tsx
import { createTaskWebSocket } from "@/api/task.ts";

useEffect(() => {
  const ws = createTaskWebSocket(
    (updatedTask) => dispatch(updateTask(updatedTask)),
    (error) => console.error("WebSocket error:", error)
  );
  
  return () => ws.close();
}, [dispatch]);
```

---

## 🛠️ 工具函数

在 `@/utils/task.ts` 中提供了便捷的工具函数：

### addNewTask
自动生成 ID 和时间戳
```tsx
import { addNewTask } from "@/utils/task.ts";

const taskId = addNewTask(dispatch, "document.pdf");
```

### simulateFileUpload
模拟文件上传（带进度）
```tsx
import { simulateFileUpload } from "@/utils/task.ts";

const taskId = await simulateFileUpload(dispatch, file);
```

### clearCompletedTasks
批量删除已完成的任务
```tsx
import { clearCompletedTasks } from "@/utils/task.ts";

const count = clearCompletedTasks(dispatch, tasks);
console.log(`删除了 ${count} 个已完成任务`);
```

### clearFailedTasks
批量删除失败的任务
```tsx
import { clearFailedTasks } from "@/utils/task.ts";

const count = clearFailedTasks(dispatch, tasks);
```

### retryFailedTask
重试失败的任务
```tsx
import { retryFailedTask } from "@/utils/task.ts";

retryFailedTask(dispatch, taskId);
```

---

## 💾 数据持久化

### 自动保存
所有 Redux actions 都会自动同步到 localStorage（key: `task_list`）

### 手动操作 localStorage
```tsx
import { setTaskList, getTaskList, clearTaskList } from "@/conf/storage.ts";

// 手动保存
setTaskList(tasks);

// 手动读取
const tasks = getTaskList();

// 清空
clearTaskList();
```

---

## 📊 完整示例

```tsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  selectTasks, 
  selectProcessingTasks,
  selectCompletedTasks,
  selectFailedTasks 
} from "@/store/task.ts";
import { addNewTask, clearCompletedTasks } from "@/utils/task.ts";

function TaskManager() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const processingTasks = useSelector(selectProcessingTasks);
  const completedTasks = useSelector(selectCompletedTasks);
  const failedTasks = useSelector(selectFailedTasks);

  const handleAddTask = () => {
    addNewTask(dispatch, `task-${Date.now()}.pdf`);
  };

  const handleClearCompleted = () => {
    const count = clearCompletedTasks(dispatch, tasks);
    alert(`已删除 ${count} 个已完成任务`);
  };

  return (
    <div>
      <h2>任务统计</h2>
      <p>总任务: {tasks.length}</p>
      <p>处理中: {processingTasks.length}</p>
      <p>已完成: {completedTasks.length}</p>
      <p>失败: {failedTasks.length}</p>

      <button onClick={handleAddTask}>添加任务</button>
      <button onClick={handleClearCompleted}>清除已完成</button>

      <h3>任务列表</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.fileName} - {task.status}
            {task.progress !== undefined && ` (${task.progress}%)`}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🎨 UI 集成示例

在 HomeNew 组件中的任务下拉面板已集成：

```tsx
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
```

---

## 🔐 类型定义

```typescript
export type TaskStatus = "processing" | "completed" | "failed";

export interface TaskItem {
  id: string;              // 唯一标识符
  fileName: string;        // 文件名
  status: TaskStatus;      // 任务状态
  createdAt?: string;      // 创建时间（ISO 8601）
  updatedAt?: string;      // 更新时间（ISO 8601）
  progress?: number;       // 进度（0-100）
  error?: string;          // 错误信息
}
```

---

## 📝 注意事项

1. ✅ 所有操作都会自动同步到 localStorage
2. ✅ 页面刷新后任务列表自动恢复
3. ✅ 无需后端 API 即可正常工作
4. ⚠️ localStorage 有大小限制（通常 5-10MB）
5. ⚠️ 敏感数据不要存储在 localStorage
6. 💡 建议定期清理已完成的任务
7. 💡 如需跨设备同步，需要实现后端 API
