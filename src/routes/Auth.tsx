import { useToast } from "@/components/ui/use-toast.ts";
import { ToastAction } from "@/components/ui/toast.tsx";
import { tokenField } from "@/conf/bootstrap.ts";
import { useEffect, useReducer } from "react";
import Loader from "@/components/Loader.tsx";
import "@/assets/pages/auth.less";
import { validateToken } from "@/store/auth.ts";
import { useDispatch } from "react-redux";
import router from "@/router.tsx";
import { useTranslation } from "react-i18next";
import { getQueryParam } from "@/utils/path.ts";
import { setMemory } from "@/utils/memory.ts";
import { appLogo, appName, useDeeptrain } from "@/conf/env.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { goAuth } from "@/utils/app.ts";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import Require, { LengthRangeRequired } from "@/components/Require.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formReducer, isTextInRange } from "@/utils/form.ts";
import { doLogin, LoginForm } from "@/api/auth.ts";
import { getErrorMessage, isEnter } from "@/utils/base.ts";

function DeepAuth() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const token = getQueryParam("token").trim();

  useEffect(() => {
    if (!token.length) {
      toast({
        title: t("invalid-token"),
        description: t("invalid-token-prompt"),
        action: (
          <ToastAction altText={t("try-again")} onClick={goAuth}>
            {t("try-again")}
          </ToastAction>
        ),
      });

      setTimeout(goAuth, 2500);
      return;
    }

    setMemory(tokenField, token);

    doLogin({ token })
      .then((data) => {
        if (!data.status) {
          toast({
            title: t("login-failed"),
            description: t("login-failed-prompt", { reason: data.error }),
            action: (
              <ToastAction altText={t("try-again")} onClick={goAuth}>
                {t("try-again")}
              </ToastAction>
            ),
          });
        } else
          validateToken(dispatch, data.token, async () => {
            toast({
              title: t("login-success"),
              description: t("login-success-prompt"),
            });

            await router.navigate("/");
          });
      })
      .catch((err) => {
        console.debug(err);
        toast({
          title: t("server-error"),
          description: `${t("server-error-prompt")}\n${err.message}`,
          action: (
            <ToastAction altText={t("try-again")} onClick={goAuth}>
              {t("try-again")}
            </ToastAction>
          ),
        });
      });
  }, []);

  return (
    <div className={`auth`}>
      <Loader prompt={t("login")} />
    </div>
  );
}

function Login() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const globalDispatch = useDispatch();
  const [form, dispatch] = useReducer(formReducer<LoginForm>(), {
    username: sessionStorage.getItem("username") || "",
    password: sessionStorage.getItem("password") || "",
  });

  const onSubmit = async () => {
    if (
      !isTextInRange(form.username, 1, 255) ||
      !isTextInRange(form.password, 6, 36)
    )
      return;

    try {
      // 虚假账号验证
      if (
        form.username.trim() === "root" &&
        form.password.trim() === "password"
      ) {
        toast({
          title: t("login-success"),
          description: t("login-success-prompt"),
        });

        // 模拟登录成功，设置完整的假数据
        const fakeToken = "fake-token-for-root-user";
        
        // 设置 token
        setMemory(tokenField, fakeToken);
        
        // 设置应用配置（模拟从后端获取的配置）
        setMemory("app_name", "QuizOnly");
        setMemory("app_logo", "/favicon.ico");
        setMemory("docs_url", "https://docs.quizonly.net");
        setMemory("blob_endpoint", "https://blob.quizonly.net");
        setMemory("buy_link", "");
        
        // 设置假的模型和计划数据
        setMemory("model_offline", JSON.stringify([
          {
            id: "gpt-3.5-turbo",
            name: "GPT-3.5 Turbo",
            description: "快速响应的对话模型",
            free: true,
            auth: true,
            default: true,
            high_context: false,
            avatar: "/icons/gpt35turbo.png",
            tag: ["chat"],
            price: 0
          },
          {
            id: "gpt-4",
            name: "GPT-4",
            description: "更强大的推理能力",
            free: false,
            auth: true,
            default: false,
            high_context: true,
            avatar: "/icons/gpt4.png",
            tag: ["chat", "advanced"],
            price: 0.03
          }
        ]));
        
        setMemory("plan_offline", JSON.stringify([
          { id: "free", name: "免费版", price: 0, level: 1 },
          { id: "pro", name: "专业版", price: 99, level: 2 },
          { id: "enterprise", name: "企业版", price: 299, level: 3 }
        ]));
        
        // 设置其他配置
        setMemory("footer", "QuizOnly - AI学习助手");
        setMemory("auth_footer", "© 2024 QuizOnly. All rights reserved.");
        setMemory("mail", "false"); // 邮件服务未启用
        setMemory("contact", "support@quizonly.net");
        setMemory("generation", "true"); // 支持生成功能
        setMemory("article", ""); // 文章链接
        setMemory("relay_plan", "false"); // 中继计划未启用
        setMemory("version", "0.0.1"); // 版本号
        
        // 直接更新 Redux 状态，不调用 validateToken（它会调用 API）
        globalDispatch({
          type: "auth/updateData",
          payload: {
            authenticated: true,
            username: "root",
            admin: false,
            userId: "fake-user-id-001",
            isVip: true,  // VIP状态
            subscriptions: [
              {
                modelId: "gpt-4",
                modelName: "GPT-4",
                subscribeTime: "2024/10/01",
                expireTime: "2025/12/31",
                amount: 99,
                autoRenew: true
              },
              {
                modelId: "claude-3",
                modelName: "Claude 3",
                subscribeTime: "2024/09/15",
                expireTime: "2025/09/15",
                amount: 79,
                autoRenew: false
              }
            ],
            usageRecords: [
              {
                type: "对话",
                modelName: "GPT-4",
                operationTime: "2024/10/05 14:30",
                amount: 1,
                unit: "次",
                remaining: 74,
                total: 100
              },
              {
                type: "文件解析",
                modelName: "GPT-4",
                operationTime: "2024/10/05 10:15",
                amount: 1,
                unit: "次",
                remaining: -1,
                total: -1
              },
              {
                type: "图片生成",
                modelName: "DALL-E 3",
                operationTime: "2024/10/04 16:20",
                amount: 2,
                unit: "张",
                remaining: 28,
                total: 50
              },
              {
                type: "对话",
                modelName: "Claude 3",
                operationTime: "2024/10/03 09:45",
                amount: 1,
                unit: "次",
                remaining: 199,
                total: 200
              }
            ]
          },
        });
        globalDispatch({
          type: "auth/setToken",
          payload: fakeToken,
        });

        // 延迟跳转，确保状态已更新
        setTimeout(() => {
          router.navigate("/myhome");
        }, 100);
        return;
      }

      const resp = await doLogin(form);
      if (!resp.status) {
        toast({
          title: t("login-failed"),
          description: t("login-failed-prompt", { reason: resp.error }),
        });
        return;
      }

      toast({
        title: t("login-success"),
        description: t("login-success-prompt"),
      });

      setMemory(tokenField, resp.token);
      validateToken(globalDispatch, resp.token, async () => {
        await router.navigate("/myhome");
      });
    } catch (err) {
      console.debug(err);
      toast({
        title: t("server-error"),
        description: t("request-error", { reason: getErrorMessage(err) }),
      });
    }
  };

  useEffect(() => {
    // listen to enter key and auto submit
    const listener = async (e: KeyboardEvent) => {
      if (isEnter(e)) await onSubmit();
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  return (
    <div className={`auth-container`}>
      <img className={`logo`} src={appLogo} alt="" />
      <div className={`title`}>
        {t("login")} {appName}
      </div>
      <Card className={`auth-card`}>
        <CardContent className={`pb-0`}>
          <div className={`auth-wrapper`}>
            <Label>
              <Require />
              {t("auth.username-or-email")}
              <LengthRangeRequired
                content={form.username}
                min={1}
                max={255}
                hideOnEmpty={true}
              />
            </Label>
            <Input
              placeholder={t("auth.username-or-email-placeholder")}
              value={form.username}
              onChange={(e) =>
                dispatch({ type: "update:username", payload: e.target.value })
              }
            />

            <Label>
              <Require />
              {t("auth.password")}
              <LengthRangeRequired
                content={form.password}
                min={6}
                max={36}
                hideOnEmpty={true}
              />
            </Label>
            <Input
              placeholder={t("auth.password-placeholder")}
              value={form.password}
              type={"password"}
              onChange={(e) =>
                dispatch({ type: "update:password", payload: e.target.value })
              }
            />

            <Button onClick={onSubmit} className={`mt-2`} loading={true}>
              {t("login")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className={`auth-card addition-wrapper`}>
        <div className={`row`}>
          {t("auth.no-account")}
          <a className={`link`} onClick={() => router.navigate("/register")}>
            {t("auth.register")}
          </a>
        </div>
        <div className={`row`}>
          {t("auth.forgot-password")}
          <a className={`link`} onClick={() => router.navigate("/forgot")}>
            {t("auth.reset-password")}
          </a>
        </div>
      </div>
    </div>
  );
}

function Auth() {
  return useDeeptrain ? <DeepAuth /> : <Login />;
}

export default Auth;
