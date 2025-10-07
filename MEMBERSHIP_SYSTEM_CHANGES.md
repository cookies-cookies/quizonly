# 会员订阅系统更新说明

## 🎯 更新概述

已将原有的"按模型订阅"系统改为"会员等级订阅"系统,统一管理用户的订阅状态。

## 📊 会员等级体系

### 四种会员等级

1. **体验用户 (trial)**
   - 价格: 免费
   - 时长: 7天
   - 功能: 基础对话、每日10次、标准速度、社区支持

2. **月会员 (monthly)** 🔥
   - 价格: ¥49
   - 时长: 1个月
   - 功能: 无限对话、优先速度、高级模型、邮件支持
   - 徽章: "热门"

3. **学期会员 (semester)** ⭐
   - 价格: ¥199
   - 时长: 6个月
   - 功能: 月会员全部 + 专属客服 + 优先体验 + 资料下载
   - 徽章: "推荐"

4. **年会员 (yearly)** 💎
   - 价格: ¥299
   - 时长: 12个月
   - 功能: 学期会员全部 + API权限 + 定制服务 + 数据导出
   - 徽章: "超值"

## 🔧 技术变更

### 1. 数据结构变更 (src/store/auth.ts)

#### 旧数据结构
```typescript
interface ModelSubscription {
  modelId: string;           // 模型ID
  modelName: string;         // 模型名称
  subscribeTime: string;
  expireTime: string;
  amount: number;
  autoRenew: boolean;
}

// State
subscriptions: ModelSubscription[]  // 多个模型订阅
```

#### 新数据结构
```typescript
type MembershipLevel = "trial" | "monthly" | "semester" | "yearly" | null;

interface MembershipSubscription {
  level: MembershipLevel;    // 会员等级
  levelName: string;         // 等级名称: "月会员", "年会员" 等
  subscribeTime: string;     // 订阅时间
  expireTime: string;        // 到期时间
  amount: number;            // 支付金额
  autoRenew: boolean;        // 是否自动续费
}

// State
membershipLevel: MembershipLevel           // 当前会员等级
subscription: MembershipSubscription | null // 单个订阅信息
```

### 2. Selector 变更

#### 删除的 Selector
```typescript
selectSubscriptions  // 已移除
```

#### 新增的 Selector
```typescript
selectMembershipLevel  // 获取会员等级
selectSubscription     // 获取订阅信息
```

### 3. 测试数据更新 (src/router.tsx)

```typescript
// 旧测试数据
subscriptions: [
  { modelId: "gpt-4", modelName: "GPT-4", ... },
  { modelId: "claude-3", modelName: "Claude 3", ... }
]

// 新测试数据
membershipLevel: "yearly",
subscription: {
  level: "yearly",
  levelName: "年会员",
  subscribeTime: "2024/10/01",
  expireTime: "2025/12/31",
  amount: 299,
  autoRenew: true
}
```

## 🎨 UI 变更

### 1. Settings 页面 (src/routes/Settings.tsx)

#### 个人中心标签
- **旧**: 显示 "VIP会员" 或 "普通用户"
- **新**: 显示具体会员等级名称 "体验用户/月会员/学期会员/年会员"

#### 付款记录标签
- **旧**: 表格显示多条模型订阅记录
- **新**: 表格显示单条会员订阅记录

| 旧表头 | 新表头 |
|--------|--------|
| 模型名称 | 会员等级 |
| 订阅时间 | 订阅时间 |
| 金额 | 金额 |
| 到期时间 | 到期时间 |
| 自动续费 | 自动续费 |
| 操作 | 操作 |

### 2. HomeNew 用户菜单 (src/routes/HomeNew.tsx)

#### 级别有效期卡片
```tsx
// 旧代码
<span className="subscription-level">
  {isVip ? "VIP版" : "免费版"}
</span>
有效期至：{subscriptions[0]?.expireTime}

// 新代码
<span className="subscription-level">
  {subscription?.levelName || "体验用户"}
</span>
有效期至：{subscription?.expireTime || "--"}
```

### 3. 续费对话框 (src/dialogs/RenewalDialog.tsx)

#### 完全重构
- **旧**: 四个标签页(付款信息/日志/修改缴纳/生成长度)
- **新**: 四个会员等级卡片选择界面

```
┌─────────────────────────────────────────────────┐
│          开通续费订阅服务                        │
├──────────┬──────────┬──────────┬──────────┤
│ 体验用户 │  月会员  │ 学期会员 │  年会员  │
│  免费    │   ¥49   │  ¥199   │  ¥299   │
│  7天     │  1个月  │  6个月  │  12个月 │
│ ✓ 功能1  │ ✓ 功能1  │ ✓ 功能1  │ ✓ 功能1 │
│ ✓ 功能2  │ ✓ 功能2  │ ✓ 功能2  │ ✓ 功能2 │
└──────────┴──────────┴──────────┴──────────┘
              ┌──────────────┐
              │  立即支付    │
              └──────────────┘
```

## 📝 使用指南

### 获取用户订阅信息

```typescript
import { useSelector } from "react-redux";
import { 
  selectMembershipLevel, 
  selectSubscription 
} from "@/store/auth.ts";

function MyComponent() {
  const membershipLevel = useSelector(selectMembershipLevel);
  const subscription = useSelector(selectSubscription);
  
  // 会员等级: "trial" | "monthly" | "semester" | "yearly" | null
  console.log(membershipLevel);
  
  // 订阅详情
  if (subscription) {
    console.log(subscription.levelName);  // "年会员"
    console.log(subscription.expireTime); // "2025/12/31"
    console.log(subscription.amount);     // 299
  }
}
```

### 判断用户权限

```typescript
import { useSelector } from "react-redux";
import { selectMembershipLevel, selectIsVip } from "@/store/auth.ts";

function checkPermission() {
  const membershipLevel = useSelector(selectMembershipLevel);
  const isVip = useSelector(selectIsVip);
  
  // 判断是否为付费用户
  if (isVip) {
    console.log("付费用户");
  }
  
  // 判断具体等级
  switch (membershipLevel) {
    case "yearly":
      // 年会员特权
      break;
    case "semester":
      // 学期会员特权
      break;
    case "monthly":
      // 月会员特权
      break;
    case "trial":
    default:
      // 体验用户限制
      break;
  }
}
```

### 打开续费对话框

```typescript
import { useState } from "react";
import RenewalDialog from "@/dialogs/RenewalDialog.tsx";

function MyComponent() {
  const [renewalOpen, setRenewalOpen] = useState(false);
  const subscription = useSelector(selectSubscription);
  
  return (
    <>
      <button onClick={() => setRenewalOpen(true)}>
        续费
      </button>
      
      <RenewalDialog
        open={renewalOpen}
        onOpenChange={setRenewalOpen}
        subscription={subscription}
      />
    </>
  );
}
```

## 🚀 后端 API 集成建议

### 1. 获取用户订阅信息 API

```typescript
// GET /api/user/subscription
{
  "status": true,
  "data": {
    "membershipLevel": "yearly",
    "subscription": {
      "level": "yearly",
      "levelName": "年会员",
      "subscribeTime": "2024/10/01",
      "expireTime": "2025/12/31",
      "amount": 299,
      "autoRenew": true
    }
  }
}
```

### 2. 订阅/续费 API

```typescript
// POST /api/subscription/subscribe
{
  "level": "monthly",  // trial, monthly, semester, yearly
  "autoRenew": true
}

// Response
{
  "status": true,
  "data": {
    "orderId": "ORD20241006123456",
    "paymentUrl": "https://payment.example.com/...",
    "subscription": { ... }
  }
}
```

### 3. 取消自动续费 API

```typescript
// POST /api/subscription/cancel-auto-renew
{
  "status": true,
  "message": "已取消自动续费"
}
```

## ⚠️ 注意事项

1. **向后兼容**: 如果后端仍返回 `subscriptions` 数组,需要在前端做数据转换
2. **测试数据**: 当前使用假数据,需对接真实 API
3. **权限控制**: 根据 `membershipLevel` 控制功能访问权限
4. **到期处理**: 需定期检查 `expireTime`,到期后降级为体验用户
5. **支付集成**: `RenewalDialog` 的 `handleSubscribe` 需对接支付 API

## 🔄 迁移检查清单

- [x] 更新 auth store 数据结构
- [x] 更新 Selectors
- [x] 更新测试数据
- [x] 修改 Settings 页面
- [x] 修改 HomeNew 用户菜单
- [x] 重构 RenewalDialog
- [ ] 对接后端订阅 API
- [ ] 对接后端支付 API
- [ ] 添加权限控制逻辑
- [ ] 添加到期提醒功能
- [ ] 添加自动续费处理

## 📞 支持

如有问题,请检查:
1. Redux DevTools 中的 `auth.subscription` 字段
2. 浏览器控制台是否有报错
3. 测试数据是否正确加载 (router.tsx)
