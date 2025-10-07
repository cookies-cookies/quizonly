import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import "@/assets/pages/renewal.less";

interface RenewalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: {
    modelId: string;
    modelName: string;
    subscribeTime: string;
    expireTime: string;
    amount: number;
    autoRenew: boolean;
  };
}

// 会员套餐类型
type MembershipType = "trial" | "monthly" | "semester" | "yearly";

interface MembershipPlan {
  id: MembershipType;
  title: string;
  price: number;
  duration: string;
  features: string[];
  badge?: string;
}

const membershipPlans: MembershipPlan[] = [
  {
    id: "trial",
    title: "体验用户",
    price: 0,
    duration: "7天",
    features: [
      "基础对话功能",
      "每日10次对话",
      "标准响应速度",
      "社区支持"
    ]
  },
  {
    id: "monthly",
    title: "月会员",
    price: 49,
    duration: "1个月",
    features: [
      "无限次对话",
      "优先响应速度",
      "高级模型访问",
      "邮件支持"
    ],
    badge: "热门"
  },
  {
    id: "semester",
    title: "学期会员",
    price: 199,
    duration: "6个月",
    features: [
      "月会员全部功能",
      "专属客服",
      "优先新功能体验",
      "学习资料下载"
    ],
    badge: "推荐"
  },
  {
    id: "yearly",
    title: "年会员",
    price: 299,
    duration: "12个月",
    features: [
      "学期会员全部功能",
      "API调用权限",
      "定制化服务",
      "数据导出功能"
    ],
    badge: "超值"
  }
];

function RenewalDialog({ open, onOpenChange }: RenewalDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<MembershipType>("monthly");

  const handleSubscribe = () => {
    const plan = membershipPlans.find(p => p.id === selectedPlan);
    console.log("订阅套餐:", plan);
    // TODO: 调用支付接口
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="renewal-dialog">
        <DialogHeader>
          <DialogTitle>开通续费订阅服务</DialogTitle>
        </DialogHeader>

        <div className="renewal-content">
          {/* 四个会员套餐卡片 */}
          <div className="membership-cards-grid">
            {membershipPlans.map((plan) => (
              <div
                key={plan.id}
                className={`membership-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && (
                  <div className="membership-badge">{plan.badge}</div>
                )}
                
                <h3 className="membership-title">{plan.title}</h3>
                
                <div className="membership-price">
                  {plan.price === 0 ? (
                    <span className="price-free">免费</span>
                  ) : (
                    <>
                      <span className="price-currency">¥</span>
                      <span className="price-value">{plan.price}</span>
                    </>
                  )}
                </div>
                
                <div className="membership-duration">{plan.duration}</div>
                
                <div className="membership-divider"></div>
                
                <ul className="membership-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-icon">✓</span>
                      <span className="feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 底部立即支付按钮 */}
          <div className="renewal-footer">
            <Button 
              className="renewal-submit-btn"
              onClick={handleSubscribe}
            >
              立即支付
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RenewalDialog;
