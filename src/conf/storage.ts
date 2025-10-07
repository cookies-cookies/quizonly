import { getMemory, setMemory, forgetMemory } from "@/utils/memory.ts";
import { Model, Plan } from "@/api/types.tsx";

export function savePreferenceModels(models: Model[]): void {
  setMemory("model_preference", models.map((item) => item.id).join(","));
}

export function getPreferenceModels(): string[] {
  const memory = getMemory("model_preference");
  return memory.length ? memory.split(",") : [];
}

export function loadPreferenceModels(models: Model[]): Model[] {
  models = models.filter((item) => item.id.length > 0 && item.name.length > 0);

  // sort by preference
  const preference = getPreferenceModels();

  return models.sort((a, b) => {
    const aIndex = preference.indexOf(a.id);
    const bIndex = preference.indexOf(b.id);

    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
}

export function setOfflineModels(models: Model[]): void {
  setMemory("model_offline", JSON.stringify(models));
}

export function parseOfflineModels(models: string): Model[] {
  try {
    const parsed = JSON.parse(models);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item): Model | null => {
        if (!item || typeof item !== "object") {
          return null;
        }

        if (!item.id || !item.name) {
          return null;
        }

        return {
          id: item.id || "",
          name: item.name || "",
          description: item.description || "",
          free: item.free || false,
          auth: item.auth || false,
          default: item.default || false,
          high_context: item.high_context || false,
          avatar: item.avatar || "",
          tag: item.tag || [],
          price: item.price,
        } as Model;
      })
      .filter((item): item is Model => item !== null);
  } catch {
    return [];
  }
}

export function getOfflineModels(): Model[] {
  const memory = getMemory("model_offline");
  return memory && memory.length ? parseOfflineModels(memory) : [];
}

export function setOfflinePlans(plans: Plan[]): void {
  setMemory("plan_offline", JSON.stringify(plans));
}

export function parseOfflinePlans(plans: string): Plan[] {
  try {
    const parsed = JSON.parse(plans);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === "object");
  } catch {
    return [];
  }
}

export function getOfflinePlans(): Plan[] {
  const memory = getMemory("plan_offline");
  return memory && memory.length ? parseOfflinePlans(memory) : [];
}

// 任务列表持久化
export type TaskItem = {
  id: string;
  fileName: string;
  status: "processing" | "completed" | "failed";
  createdAt?: string;
  updatedAt?: string;
  progress?: number;
  error?: string;
};

export function setTaskList(tasks: TaskItem[]): void {
  setMemory("task_list", JSON.stringify(tasks));
}

export function getTaskList(): TaskItem[] {
  const memory = getMemory("task_list");
  if (!memory || !memory.length) return [];
  
  try {
    const parsed = JSON.parse(memory);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.id &&
        item.fileName &&
        item.status
    );
  } catch {
    return [];
  }
}

export function clearTaskList(): void {
  forgetMemory("task_list");
}

// 用户订阅和使用记录持久化
import type { ModelSubscription, UsageRecord } from "@/store/auth.ts";

export function setUserSubscriptions(subscriptions: ModelSubscription[]): void {
  setMemory("user_subscriptions", JSON.stringify(subscriptions));
}

export function getUserSubscriptions(): ModelSubscription[] {
  const memory = getMemory("user_subscriptions");
  if (!memory || !memory.length) return [];
  
  try {
    const parsed = JSON.parse(memory);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.modelId &&
        item.modelName &&
        item.subscribeTime &&
        item.expireTime
    );
  } catch {
    return [];
  }
}

export function setUsageRecords(records: UsageRecord[]): void {
  setMemory("usage_records", JSON.stringify(records));
}

export function getUserUsageRecords(): UsageRecord[] {
  const memory = getMemory("usage_records");
  if (!memory || !memory.length) return [];
  
  try {
    const parsed = JSON.parse(memory);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.type &&
        item.modelName &&
        item.operationTime
    );
  } catch {
    return [];
  }
}

export function setUserVipStatus(isVip: boolean): void {
  setMemory("user_is_vip", isVip ? "true" : "false");
}

export function getUserVipStatus(): boolean {
  const memory = getMemory("user_is_vip");
  return memory === "true";
}

export function clearUserData(): void {
  forgetMemory("user_subscriptions");
  forgetMemory("usage_records");
  forgetMemory("user_is_vip");
}
