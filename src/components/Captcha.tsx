import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import Require from "@/components/Require.tsx";
import { useTranslation } from "react-i18next";

type CaptchaProps = {
    value: string;
    onChange: (value: string) => void;
    onVerify: (verified: boolean) => void;
};

function Captcha({ value, onChange, onVerify }: CaptchaProps) {
    const { t } = useTranslation();
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [correctAnswer, setCorrectAnswer] = useState(0);

    // 生成新的验证码题目
    const generateCaptcha = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setNum1(n1);
        setNum2(n2);
        setCorrectAnswer(n1 + n2);
        onChange(""); // 清空输入
        onVerify(false); // 重置验证状态
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    useEffect(() => {
        // 验证答案
        const userAnswer = parseInt(value);
        if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
            onVerify(true);
        } else {
            onVerify(false);
        }
    }, [value, correctAnswer]);

    return (
        <div className="captcha-wrapper">
            <Label>
                <Require />
                {t("auth.captcha")}
            </Label>
            <div className="flex flex-row items-center gap-2">
                <div className="w-32 text-center py-2 border rounded-md bg-secondary text-base font-semibold select-none">
                    {num1} + {num2} = ?
                </div>
                <Input
                    className="flex-1"
                    placeholder={t("auth.captcha-placeholder")}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    type="text"
                    autoComplete="off"
                />
                <button
                    type="button"
                    className="text-sm text-primary underline underline-offset-4 cursor-pointer whitespace-nowrap"
                    onClick={generateCaptcha}
                >
                    {t("auth.refresh-captcha")}
                </button>
            </div>
        </div>
    );
}

export default Captcha;
