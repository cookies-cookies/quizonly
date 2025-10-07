# 续费对话框使用说明

## 📦 已创建的文件

1. **对话框组件**: `src/dialogs/RenewalDialog.tsx`
2. **样式文件**: `src/assets/pages/renewal.less`
3. **已更新**: `src/routes/Settings.tsx` (集成续费功能)

## 🎯 功能特性

### 四个功能标签页

1. **付款信息** - 显示当前订阅的详细信息
   - 订阅模型名称
   - 当前订阅时间
   - 到期时间
   - 续费金额
   - 自动续费状态
   - 续费说明提示

2. **日志** - 显示历史续费记录
   - 续费时间
   - 模型名称
   - 支付金额
   - 订单状态
   - 订单号

3. **修改缴纳** - 调整续费设置
   - 选择续费套餐金额 (¥49/¥99/¥199)
   - 开启/关闭自动续费
   - 实时提示续费说明

4. **生成长度** - 显示使用额度说明
   - 对话生成次数和长度
   - 图片生成次数和分辨率
   - 文件解析次数和大小限制

## 💡 使用方式

### 在 Settings 页面使用

已经集成到 Settings 页面的"付款记录"标签中:

```tsx
// 每条订阅记录都有一个"续费"按钮
<Button onClick={() => handleRenewalClick(subscription)}>
  续费
</Button>
```

### 在其他地方使用

可以在任何组件中导入使用:

```tsx
import RenewalDialog from "@/dialogs/RenewalDialog.tsx";
import { useState } from "react";

function YourComponent() {
  const [renewalOpen, setRenewalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  const handleRenewal = (subscription) => {
    setSelectedSub(subscription);
    setRenewalOpen(true);
  };

  return (
    <>
      <button onClick={() => handleRenewal(subscriptionData)}>
        续费
      </button>
      
      <RenewalDialog
        open={renewalOpen}
        onOpenChange={setRenewalOpen}
        subscription={selectedSub}
      />
    </>
  );
}
```

## 📝 Subscription 数据格式

```typescript
interface Subscription {
  modelId: string;        // 模型ID
  modelName: string;      // 模型名称，如 "GPT-4"
  subscribeTime: string;  // 订阅时间，如 "2024/10/01"
  expireTime: string;     // 到期时间，如 "2025/12/31"
  amount: number;         // 金额，如 99
  autoRenew: boolean;     // 是否自动续费
}
```

## 🎨 设计亮点

1. **四标签布局** - 严格按照你的手绘稿设计
   - 顶部标签导航
   - 图标 + 文字标签
   - 活跃状态高亮
   - 平滑切换动画

2. **付款信息卡片** - 清晰展示订阅详情
   - 重点突出到期时间(红色)
   - 金额高亮显示(蓝色大字)
   - 温馨提示说明

3. **日志表格** - 专业的历史记录展示
   - 表头固定
   - 悬停高亮
   - 状态徽章(成功/失败)
   - 订单号等宽字体

4. **设置面板** - 交互友好的配置界面
   - 三档金额选择卡片
   - 自定义开关按钮
   - 实时状态提示

5. **额度说明** - 图标化的额度展示
   - Emoji 图标
   - 卡片式布局
   - 悬停效果

6. **立即支付按钮** - 醒目的底部操作按钮
   - 渐变背景
   - 悬停动画
   - 全宽居中布局

## 🔧 待实现功能

以下功能需要后端 API 支持:

1. **实际续费逻辑** - `handleRenewal` 函数中调用支付 API
2. **获取续费日志** - 从服务器获取真实历史记录
3. **修改自动续费** - 更新到服务器
4. **支付集成** - 对接支付宝/微信支付等

当前在 `RenewalDialog.tsx` 第 50 行的 `handleRenewal` 函数中:
```tsx
const handleRenewal = () => {
  // TODO: 实现续费逻辑
  console.log("执行续费:", {
    modelName: subscription?.modelName,
    amount: selectedAmount,
    autoRenew: autoRenew
  });
  // 这里应该调用后端 API
  onOpenChange(false);
};
```

## 🎯 下一步建议

1. **集成支付 API** - 对接实际支付流程
2. **添加表单验证** - 确保数据完整性
3. **错误处理** - 支付失败、网络错误等
4. **加载状态** - 支付过程中的 loading 状态
5. **成功提示** - Toast 通知或成功弹窗
6. **权限控制** - 非 VIP 用户的续费限制

## 📱 响应式支持

已完全支持移动端:
- 平板设备 (768px)
- 手机设备 (640px)
- 标签自适应布局

## 🎉 特别说明

此对话框完全按照你的手绘设计稿实现,包含:
- ✅ 顶部四个标签 (付款信息、日志、修改缴纳、生成长度)
- ✅ 底部立即支付按钮
- ✅ 完整的交互逻辑
- ✅ 专业的视觉设计
- ✅ 流畅的动画效果

可以直接在 Settings 页面的"付款记录"中点击"续费"按钮体验!
