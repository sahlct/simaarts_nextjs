// /lib/auth.ts

const TOKEN_KEY = "accessToken";

// In-memory fallback if localStorage is blocked by user's browser settings/in-app browsers
const memoryStore: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("Storage access denied. Using in-memory fallback.", e);
    }
    return memoryStore[key] || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn("Storage access denied. Using in-memory fallback.", e);
    }
    memoryStore[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn("Storage access denied. Using in-memory fallback.", e);
    }
    delete memoryStore[key];
  }
};

export const setToken = (token: string) => {
  safeStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return safeStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  safeStorage.removeItem(TOKEN_KEY);
  safeStorage.removeItem("refreshToken");
};
