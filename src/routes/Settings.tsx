import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
    selectUsername, 
    selectUserId, 
    selectIsVip,
    selectMembershipLevel,
    selectSubscription,
    selectUsageRecords
} from "@/store/auth.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ArrowLeft, User, Coins, CreditCard } from "lucide-react";
import RenewalDialog from "@/dialogs/RenewalDialog.tsx";
import "@/assets/pages/settings.less";

type SettingsTab = "profile" | "quota" | "payment";

function Settings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
    
    // 从 Redux store 获取用户信息
    const username = useSelector(selectUsername);
    const userId = useSelector(selectUserId);
    const isVip = useSelector(selectIsVip);
    const membershipLevel = useSelector(selectMembershipLevel);
    const subscription = useSelector(selectSubscription);
    const usageRecords = useSelector(selectUsageRecords);

    const menuItems = [
        { id: "profile" as SettingsTab, label: "个人中心", icon: <User className="h-5 w-5" /> },
        { id: "quota" as SettingsTab, label: "我的额度", icon: <Coins className="h-5 w-5" /> },
        { id: "payment" as SettingsTab, label: "付款记录", icon: <CreditCard className="h-5 w-5" /> },
    ];

    const handleRenewalClick = (subscription: any) => {
        setSelectedSubscription(subscription);
        setRenewalDialogOpen(true);
    };
    
    // 获取会员等级名称
    const getMembershipLevelName = () => {
        if (!membershipLevel) return "体验用户";
        const levelNames: Record<string, string> = {
            "trial": "体验用户",
            "monthly": "月会员",
            "semester": "学期会员",
            "yearly": "年会员"
        };
        return levelNames[membershipLevel] || "体验用户";
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="settings-section">
                        <h2 className="section-title">个人中心</h2>
                        <div className="section-content">
                            <div className="form-group">
                                <Label>用户名：{username}</Label>
                            </div>
                            <div className="form-group">
                                <Label>用户ID：{userId || "未设置"}</Label>
                            </div>
                            <div className="form-group">
                                <Label>VIP状态：{isVip ? getMembershipLevelName() : "体验用户"}</Label>
                            </div>
                            <div className="form-group">
                                <Label>有效期至：{subscription?.expireTime || "未订阅"}</Label>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="new-password">修改密码</Label>
                                <Input 
                                    id="new-password" 
                                    type="password" 
                                    placeholder="新密码" 
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="confirm-password">确认新密码</Label>
                                <Input 
                                    id="confirm-password" 
                                    type="password" 
                                    placeholder="确认新密码" 
                                    className="form-input"
                                />
                            </div>
                            <div className="form-actions">
                                <Button className="confirm-btn">确认修改</Button>
                            </div>
                        </div>
                    </div>
                );
            case "quota":
                return (
                    <div className="settings-section">
                        <h2 className="section-title">我的额度 - 使用记录</h2>
                        <div className="section-content">
                            {usageRecords.length > 0 ? (
                                <div className="quota-table-wrapper">
                                    <table className="quota-table">
                                        <thead>
                                            <tr>
                                                <th>操作时间</th>
                                                <th>类型</th>
                                                <th>模型</th>
                                                <th>总额度</th>
                                                <th>剩余额度</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usageRecords.map((record, index) => (
                                                <tr key={index}>
                                                    <td>{record.operationTime}</td>
                                                    <td>{record.type}</td>
                                                    <td>{record.modelName}</td>
                                                    <td>
                                                        {record.total === -1 ? "无限" : `${record.total} ${record.unit}`}
                                                    </td>
                                                    <td className="remaining-cell">
                                                        {record.remaining === -1 ? "无限" : `${record.remaining} ${record.unit}`}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="empty-state">暂无使用记录</p>
                            )}
                        </div>
                    </div>
                );
            case "payment":
                return (
                    <div className="settings-section">
                        <h2 className="section-title">付款记录 - 会员订阅</h2>
                        <div className="section-content">
                            {subscription ? (
                                <div className="payment-table-wrapper">
                                    <table className="payment-table">
                                        <thead>
                                            <tr>
                                                <th>订阅时间</th>
                                                <th>会员等级</th>
                                                <th>金额</th>
                                                <th>到期时间</th>
                                                <th>自动续费</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{subscription.subscribeTime}</td>
                                                <td>{subscription.levelName}</td>
                                                <td className="amount-cell">¥{subscription.amount}</td>
                                                <td>{subscription.expireTime}</td>
                                                <td>{subscription.autoRenew ? "是" : "否"}</td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRenewalClick(subscription)}
                                                        className="renewal-btn"
                                                    >
                                                        续费
                                                    </Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="empty-state">暂无付款记录</p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="settings-page-new">
            {/* 返回按钮 */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="back-btn-floating"
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="settings-layout">
                {/* 左侧菜单栏 */}
                <aside className="settings-sidebar">
                    <nav className="settings-nav">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* 右侧内容区 */}
                <main className="settings-main">
                    {renderContent()}
                </main>
            </div>

            {/* 续费对话框 */}
            <RenewalDialog
                open={renewalDialogOpen}
                onOpenChange={setRenewalDialogOpen}
                subscription={selectedSubscription}
            />
        </div>
    );
}

export default Settings;
