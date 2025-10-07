import { Card, CardContent } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import Require, {
  EmailRequire,
  LengthRangeRequired,
  SameRequired,
} from "@/components/Require.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import router from "@/router.tsx";
import { useTranslation } from "react-i18next";
import { formReducer, isEduEmailValid, isTextInRange } from "@/utils/form.ts";
import { useReducer, useState } from "react";
import { doRegister, RegisterForm, sendCode } from "@/api/auth.ts";
import { useToast } from "@/components/ui/use-toast.ts";
import TickButton from "@/components/TickButton.tsx";
import { validateToken } from "@/store/auth.ts";
import { useDispatch, useSelector } from "react-redux";
import { appLogo, appName } from "@/conf/env.ts";
import { infoMailSelector } from "@/store/info.ts";
import Captcha from "@/components/Captcha.tsx";

function doFormat(form: RegisterForm): RegisterForm {
  return {
    ...form,
    username: form.email.split("@")[0], // 使用邮箱前缀作为用户名
    password: form.password.trim(),
    repassword: form.repassword.trim(),
    email: form.email.trim(),
    code: form.code.trim(),
  };
}

function Register() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const globalDispatch = useDispatch();
  const mail = useSelector(infoMailSelector);
  
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [form, dispatch] = useReducer(formReducer<RegisterForm>(), {
    username: "",
    password: "",
    repassword: "",
    email: "",
    code: "",
  });

  const onVerifyEmail = async () => {
    if (!captchaVerified) {
      toast({
        title: t("error"),
        description: t("auth.captcha-required"),
      });
      return false;
    }

    if (!isEduEmailValid(form.email)) {
      toast({
        title: t("error"),
        description: t("auth.invalid-edu-email"),
      });
      return false;
    }

    return await sendCode(t, toast, form.email, true);
  };

  const onSubmit = async () => {
    // 验证邮箱
    if (!isEduEmailValid(form.email)) {
      toast({
        title: t("error"),
        description: t("auth.invalid-edu-email"),
      });
      return;
    }

    // 验证邮箱验证码
    if (mail && form.code.trim().length === 0) {
      toast({
        title: t("error"),
        description: t("auth.code-placeholder"),
      });
      return;
    }

    // 验证密码
    if (
      !isTextInRange(form.password, 6, 36) ||
      form.password.trim() !== form.repassword.trim()
    ) {
      return;
    }

    const data = doFormat(form);

    const resp = await doRegister(data);
    if (!resp.status) {
      toast({
        title: t("error"),
        description: resp.error,
      });
      return;
    }

    toast({
      title: t("auth.register-success"),
      description: t("auth.register-success-prompt"),
    });

    validateToken(globalDispatch, resp.token);
    await router.navigate("/myhome");
  };

  return (
    <div className={`auth-container`}>
      <img className={`logo`} src={appLogo} alt="" />
      <div className={`title`}>
        {t("register")} {appName}
      </div>
      <Card className={`auth-card`}>
        <CardContent className={`pb-0`}>
          <div className={`auth-wrapper`}>
            {/* 邮箱 */}
            <Label>
              <Require />
              {t("auth.email")}
              <EmailRequire content={form.email} hideOnEmpty={true} eduOnly={true} />
            </Label>
            <Input
              placeholder={t("auth.email-placeholder")}
              value={form.email}
              onChange={(e) =>
                dispatch({
                  type: "update:email",
                  payload: e.target.value,
                })
              }
            />

            {/* 人机验证码 */}
            <Captcha
              value={captchaValue}
              onChange={setCaptchaValue}
              onVerify={setCaptchaVerified}
            />

            {/* 邮箱验证码 */}
            <Label>
              <Require /> {t("auth.code")}
            </Label>
            <div className={`flex flex-row`}>
              <Input
                disabled={!mail}
                placeholder={
                  mail
                    ? t("auth.code-placeholder")
                    : t("auth.code-disabled-placeholder")
                }
                value={form.code}
                onChange={(e) =>
                  dispatch({
                    type: "update:code",
                    payload: e.target.value,
                  })
                }
              />
              <TickButton
                className={`ml-2 whitespace-nowrap`}
                loading={true}
                onClick={onVerifyEmail}
                tick={60}
                disabled={!mail || !captchaVerified}
              >
                {t("auth.send-code")}
              </TickButton>
            </div>

            {/* 密码 */}
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
                dispatch({
                  type: "update:password",
                  payload: e.target.value,
                })
              }
            />

            {/* 确认密码 */}
            <Label>
              <Require />
              {t("auth.check-password")}
              <SameRequired
                content={form.password}
                compare={form.repassword}
                hideOnEmpty={true}
              />
            </Label>
            <Input
              placeholder={t("auth.check-password-placeholder")}
              value={form.repassword}
              type={"password"}
              onChange={(e) =>
                dispatch({
                  type: "update:repassword",
                  payload: e.target.value,
                })
              }
            />

            {/* 注册按钮 */}
            <Button className={`mt-2`} loading={true} onClick={onSubmit}>
              {t("register")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className={`auth-card addition-wrapper`}>
        <div className={`row`}>
          {t("auth.have-account")}
          <a className={`link`} onClick={() => router.navigate("/login")}>
            {t("auth.login")}
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

export default Register;
