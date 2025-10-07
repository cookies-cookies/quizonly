import { createContext, useContext, useEffect, useState } from "react";
import { setMemory } from "@/utils/memory.ts";
import { themeEvent } from "@/events/theme.ts";

// const defaultTheme: Theme = "light";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme?: () => void;
};

export function activeTheme(theme: Theme) {
  const root = window.document.documentElement;

  root.classList.remove("light", "dark");
  if (theme === "system")
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  root.classList.add(theme);
  setMemory("theme", theme);
  themeEvent.emit(theme);
}

export function getTheme() {
  // 强制返回 light 主题
  return "light";
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => {
    // 禁用主题切换
  },
  toggleTheme: () => {
    // 禁用主题切换
  },
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  defaultTheme = "light",
  ...props
}: ThemeProviderProps) {
  // 强制使用 light 主题
  const [theme] = useState<Theme>("light");

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    // 强制应用 light 主题
    root.classList.add("light");
  }, []);

  const value = {
    theme,
    setTheme: () => {
      // 禁用主题切换，强制 light
      console.log('Theme switching is disabled, using light theme only');
    },
  };

  return <ThemeProviderContext.Provider {...props} value={value} />;
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

export function ModeToggle() {
  // 主题切换已禁用，返回 null 不显示按钮
  return null;
}

export default ModeToggle;
