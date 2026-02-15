/**
 * ブラウザAPI統一レイヤー
 * Chrome/Firefox両対応
 */

// ブラウザAPIの型定義
type BrowserAPI = typeof chrome | typeof browser;

/**
 * 実行環境のブラウザAPIを取得
 */
function getBrowserAPI(): BrowserAPI {
  if (typeof browser !== 'undefined') {
    return browser; // Firefox
  }
  if (typeof chrome !== 'undefined') {
    return chrome; // Chrome
  }
  throw new Error('No browser API available');
}

const api = getBrowserAPI();

/**
 * ストレージAPI（Promise統一）
 */
export const storage = {
  async get<T = any>(key: string): Promise<T | undefined> {
    if (typeof browser !== 'undefined') {
      // Firefox: Promise
      const result = await browser.storage.local.get(key);
      return result[key] as T;
    } else {
      // Chrome: Callback → Promise変換
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
          resolve(result[key] as T);
        });
      });
    }
  },

  async set(key: string, value: any): Promise<void> {
    if (typeof browser !== 'undefined') {
      await browser.storage.local.set({ [key]: value });
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => resolve());
      });
    }
  },

  async remove(key: string): Promise<void> {
    if (typeof browser !== 'undefined') {
      await browser.storage.local.remove(key);
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.remove(key, () => resolve());
      });
    }
  },

  async clear(): Promise<void> {
    if (typeof browser !== 'undefined') {
      await browser.storage.local.clear();
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.clear(() => resolve());
      });
    }
  },
};

/**
 * Runtime API
 */
export const runtime = {
  getManifest() {
    return api.runtime.getManifest();
  },

  sendMessage<T = any>(message: any): Promise<T> {
    if (typeof browser !== 'undefined') {
      return browser.runtime.sendMessage(message);
    } else {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, resolve);
      });
    }
  },

  onMessage: {
    addListener(
      callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void | boolean
    ) {
      api.runtime.onMessage.addListener(callback);
    },
  },
};

/**
 * Tabs API
 */
export const tabs = {
  async create(options: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> {
    if (typeof browser !== 'undefined') {
      const result = await browser.tabs.create(options as unknown as Parameters<typeof browser.tabs.create>[0]);
      return result as unknown as chrome.tabs.Tab;
    } else {
      return new Promise((resolve) => {
        chrome.tabs.create(options, resolve);
      });
    }
  },

  async remove(tabId: number): Promise<void> {
    if (typeof browser !== 'undefined') {
      await browser.tabs.remove(tabId);
    } else {
      return new Promise((resolve) => {
        chrome.tabs.remove(tabId, () => resolve());
      });
    }
  },
};
