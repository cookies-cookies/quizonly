import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { isEmailValid, isEduEmailValid } from "@/utils/form.ts";
import { cn } from "@/components/ui/lib/utils.ts";

function Required() {
  return <span className={`text-red-500 mr-0.5`}>*</span>;
}

export type LengthRangeRequiredProps = {
  content: string;
  min: number;
  max: number;
  hideOnEmpty?: boolean;
};

export function LengthRangeRequired({
  content,
  min,
  max,
  hideOnEmpty,
}: LengthRangeRequiredProps) {
  const { t } = useTranslation();
  const onDisplay = useMemo(() => {
    if (hideOnEmpty && content.length === 0) return false;
    return content.length < min || content.length > max;
  }, [content, min, max, hideOnEmpty]);

  return (
    <span
      className={cn(
        "ml-1 text-red-500 transition-opacity",
        !onDisplay && "opacity-0",
      )}
    >
      ({t("auth.length-range", { min, max })})
    </span>
  );
}

export type SameRequiredProps = {
  content: string;
  compare: string;
  hideOnEmpty?: boolean;
};

export function SameRequired({
  content,
  compare,
  hideOnEmpty,
}: SameRequiredProps) {
  const { t } = useTranslation();
  const onDisplay = useMemo(() => {
    if (hideOnEmpty && compare.length === 0) return false;
    return content !== compare;
  }, [content, compare, hideOnEmpty]);

  return (
    <span
      className={cn(
        "ml-1 text-red-500 transition-opacity",
        !onDisplay && "opacity-0",
      )}
    >
      ({t("auth.same-rule")})
    </span>
  );
}

export type EmailRequireProps = {
  content: string;
  hideOnEmpty?: boolean;
  eduOnly?: boolean; // 是否只允许教育邮箱
};

export function EmailRequire({ content, hideOnEmpty, eduOnly }: EmailRequireProps) {
  const { t } = useTranslation();
  const onDisplay = useMemo(() => {
    if (hideOnEmpty && content.length === 0) return false;
    if (eduOnly) {
      return !isEduEmailValid(content);
    }
    return !isEmailValid(content);
  }, [content, hideOnEmpty, eduOnly]);

  return (
    <span
      className={cn(
        "ml-1 text-red-500 transition-opacity",
        !onDisplay && "opacity-0",
      )}
    >
      ({eduOnly ? t("auth.invalid-edu-email") : t("auth.invalid-email")})
    </span>
  );
}

export default Required;
