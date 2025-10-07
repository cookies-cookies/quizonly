import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
//import Home from "./routes/Home.tsx";
import HomeNew from "./routes/HomeNew.tsx";
import NotFound from "./routes/NotFound.tsx";
import Auth from "./routes/Auth.tsx";
import React, { Suspense, useEffect } from "react";
import { useDeeptrain } from "@/conf/env.ts";
import Register from "@/routes/Register.tsx";
import Forgot from "@/routes/Forgot.tsx";
import { lazyFactor } from "@/utils/loader.tsx";
import { useDispatch, useSelector } from "react-redux";
import { selectAdmin, selectAuthenticated, selectInit } from "@/store/auth.ts";
import { tokenField } from "@/conf/bootstrap.ts";
import { getMemory } from "@/utils/memory.ts";

const Landing = lazyFactor(() => import("@/routes/Landing.tsx"));
const Generation = lazyFactor(() => import("@/routes/Generation.tsx"));
const Sharing = lazyFactor(() => import("@/routes/Sharing.tsx"));
const Article = lazyFactor(() => import("@/routes/Article.tsx"));
const Settings = lazyFactor(() => import("@/routes/Settings.tsx"));

const Admin = lazyFactor(() => import("@/routes/Admin.tsx"));
const Dashboard = lazyFactor(() => import("@/routes/admin/DashBoard.tsx"));
const Market = lazyFactor(() => import("@/routes/admin/Market.tsx"));
const Channel = lazyFactor(() => import("@/routes/admin/Channel.tsx"));
const System = lazyFactor(() => import("@/routes/admin/System.tsx"));
const Charge = lazyFactor(() => import("@/routes/admin/Charge.tsx"));
const Users = lazyFactor(() => import("@/routes/admin/Users.tsx"));
const Broadcast = lazyFactor(() => import("@/routes/admin/Broadcast.tsx"));
const Subscription = lazyFactor(
  () => import("@/routes/admin/Subscription.tsx"),
);
const Logger = lazyFactor(() => import("@/routes/admin/Logger.tsx"));
const MemoDetail = lazyFactor(() => import("@/routes/MemoDetail.tsx"));
const PDFViewer = lazyFactor(() => import("@/routes/PDFViewer.tsx"));

const router = createBrowserRouter(
  [
    {
      id: "home",
      path: "/",
      element: (
        <Suspense>
          <HomeOrLanding />
        </Suspense>
      ),
      ErrorBoundary: NotFound,
    },
    {
      id: "myhome",
      path: "/myhome",
      element: (
        <AuthRequired>
          <HomeNew />
        </AuthRequired>
      ),
      ErrorBoundary: NotFound,
    },
    {
      id: "login",
      path: "/login",
      element: (
        <AuthForbidden>
          <Auth />
        </AuthForbidden>
      ),
      ErrorBoundary: NotFound,
    },
    !useDeeptrain &&
      ({
        id: "register",
        path: "/register",
        element: (
          <AuthForbidden>
            <Register />
          </AuthForbidden>
        ),
        ErrorBoundary: NotFound,
      } as any),
    !useDeeptrain &&
      ({
        id: "forgot",
        path: "/forgot",
        element: (
          <AuthForbidden>
            <Forgot />
          </AuthForbidden>
        ),
        ErrorBoundary: NotFound,
      } as any),
    {
      id: "generation",
      path: "/generate",
      element: (
        <AuthRequired>
          <Suspense>
            <Generation />
          </Suspense>
        </AuthRequired>
      ),
      ErrorBoundary: NotFound,
    },
    {
      id: "settings",
      path: "/settings",
      element: (
        <AuthRequired>
          <Suspense>
            <Settings />
          </Suspense>
        </AuthRequired>
      ),
      ErrorBoundary: NotFound,
    },
    {
      id: "share",
      path: "/share/:hash",
      element: (
        <Suspense>
          <Sharing />
        </Suspense>
      ),
      ErrorBoundary: NotFound,
    },
    {
      id: "article",
      path: "/article",
      element: (
        <AuthRequired>
          <Suspense>
            <Article />
          </Suspense>
        </AuthRequired>
      ),
      ErrorBoundary: NotFound,
    },
    {
      id: "memo-detail",
      path: "/memo/:id",
      element: (
        <AuthRequired>
          <Suspense>
            <MemoDetail />
          </Suspense>
        </AuthRequired>
      ),
      ErrorBoundary: NotFound,
    },
    {
      id: "pdf-viewer",
      path: "/pdf/:id",
      element: (
        <AuthRequired>
          <Suspense>
            <PDFViewer />
          </Suspense>
        </AuthRequired>
      ),
      ErrorBoundary: NotFound,
    },
    {
      id: "admin",
      path: "/admin",
      element: (
        <AdminRequired>
          <Suspense>
            <Admin />
          </Suspense>
        </AdminRequired>
      ),
      children: [
        {
          id: "admin-dashboard",
          path: "",
          element: (
            <Suspense>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          id: "admin-users",
          path: "users",
          element: (
            <Suspense>
              <Users />
            </Suspense>
          ),
        },
        {
          id: "admin-market",
          path: "market",
          element: (
            <Suspense>
              <Market />
            </Suspense>
          ),
        },
        {
          id: "admin-channel",
          path: "channel",
          element: (
            <Suspense>
              <Channel />
            </Suspense>
          ),
        },
        {
          id: "admin-system",
          path: "system",
          element: (
            <Suspense>
              <System />
            </Suspense>
          ),
        },
        {
          id: "admin-charge",
          path: "charge",
          element: (
            <Suspense>
              <Charge />
            </Suspense>
          ),
        },
        {
          id: "admin-broadcast",
          path: "broadcast",
          element: (
            <Suspense>
              <Broadcast />
            </Suspense>
          ),
        },
        {
          id: "admin-subscription",
          path: "subscription",
          element: (
            <Suspense>
              <Subscription />
            </Suspense>
          ),
        },
        {
          id: "admin-logger",
          path: "logger",
          element: (
            <Suspense>
              <Logger />
            </Suspense>
          ),
        },
      ],
      ErrorBoundary: NotFound,
    },
    {
      id: "not-found",
      path: "*",
      element: <NotFound />,
    },
  ].filter(Boolean),
);

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const init = useSelector(selectInit);
  const authenticated = useSelector(selectAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // 初始化认证状态（如果还未初始化）
  useEffect(() => {
    if (!init) {
      const token = getMemory(tokenField);
      
      if (token === "fake-token-for-root-user") {
        // 假 token，恢复登录状态
        dispatch({
          type: "auth/updateData",
          payload: {
            authenticated: true,
            username: "root",
            admin: false,
            userId: "fake-user-id-001",
            isVip: true,
            membershipLevel: "yearly",  // 年会员
            subscription: {
              level: "yearly",
              levelName: "年会员",
              subscribeTime: "2024/10/01",
              expireTime: "2025/12/31",
              amount: 299,
              autoRenew: true
            },
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
              }
            ]
          },
        });
        dispatch({
          type: "auth/setToken",
          payload: token,
        });
      } else if (!token || token.trim() === "") {
        // 没有 token，设置为未认证
        dispatch({
          type: "auth/updateData",
          payload: {
            authenticated: false,
            username: "",
            admin: false,
          },
        });
      } else {
        // 有真实 token，但需要后端验证（暂时设置为未认证）
        dispatch({
          type: "auth/updateData",
          payload: {
            authenticated: false,
            username: "",
            admin: false,
          },
        });
      }
    }
  }, [init, dispatch]);

  useEffect(() => {
    if (init && !authenticated) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [init, authenticated, navigate, location.pathname]);

  // 等待初始化或者未认证时不显示内容
  if (!init || !authenticated) {
    return null;
  }

  return <>{children}</>;
}

export function HomeOrLanding() {
  const init = useSelector(selectInit);
  const authenticated = useSelector(selectAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 初始化认证状态
  useEffect(() => {
    const token = getMemory(tokenField);
    
    if (!init) {
      // 如果是虚假 token，直接设置状态
      if (token === "fake-token-for-root-user") {
        dispatch({
          type: "auth/updateData",
          payload: {
            authenticated: true,
            username: "root",
            admin: false,
            userId: "fake-user-id-001",
            isVip: true,
            membershipLevel: "yearly",  // 年会员
            subscription: {
              level: "yearly",
              levelName: "年会员",
              subscribeTime: "2024/10/01",
              expireTime: "2025/12/31",
              amount: 299,
              autoRenew: true
            },
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
              }
            ]
          },
        });
        dispatch({
          type: "auth/setToken",
          payload: token,
        });
      } else if (!token || token.trim() === "") {
        // 没有 token，设置为未认证
        dispatch({
          type: "auth/updateData",
          payload: {
            authenticated: false,
            username: "",
            admin: false,
          },
        });
      }
      // 如果有真实 token，这里不处理（需要后端验证）
    }
  }, [init, dispatch]);

  useEffect(() => {
    // 如果已认证，自动跳转到 /myhome
    if (init && authenticated) {
      navigate("/myhome", { replace: true });
    }
  }, [init, authenticated, navigate]);

  if (!init) {
    return null; // 等待初始化
  }

  return authenticated ? null : <Landing />;
}

export function AuthForbidden({ children }: { children: React.ReactNode }) {
  const init = useSelector(selectInit);
  const authenticated = useSelector(selectAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (init && authenticated) {
      navigate("/myhome", { state: { from: location.pathname } });
    }
  }, [init, authenticated]);

  return <>{children}</>;
}

export function AdminRequired({ children }: { children: React.ReactNode }) {
  const init = useSelector(selectInit);
  const admin = useSelector(selectAdmin);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (init && !admin) {
      navigate("/", { state: { from: location.pathname } });
    }
  }, [init, admin]);

  return <>{children}</>;
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default router;
