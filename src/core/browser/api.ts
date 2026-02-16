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
    return browser; // Firefox / Polyfilled Chrome
  }
  if (typeof chrome !== 'undefined') {
    return chrome; // Chrome native
  }
  throw new Error('No browser API available');
}

const api = getBrowserAPI();

/**
 * ストレージAPI（Promise統一）
 */
export const storage = {
  async get<T = any>(key: string): Promise<T | undefined> {
    const result = await api.storage.local.get(key);
    return result[key] as T;
  },

  async set(key: string, value: any): Promise<void> {
    await api.storage.local.set({ [key]: value });
  },

  async remove(key: string): Promise<void> {
    await api.storage.local.remove(key);
  },

  async clear(): Promise<void> {
    await api.storage.local.clear();
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
    return api.runtime.sendMessage(message);
  },

  onMessage: {
    addListener(
      callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void | boolean
    ) {
      api.runtime.onMessage.addListener(callback);
    },
  },

  getURL(path: string): string {
    return api.runtime.getURL(path);
  }
};

/**
 * Tabs API
 */
export const tabs = {
  async create(options: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> {
    return await api.tabs.create(options as any) as any;
  },

  async remove(tabId: number): Promise<void> {
    await api.tabs.remove(tabId);
  },

  onUpdated: {
    addListener(
      callback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void
    ) {
      api.tabs.onUpdated.addListener(callback as any);
    }
  }
};

/**
 * DeclarativeNetRequest API
 */
export const declarativeNetRequest = {
  async updateDynamicRules(options: {
    addRules?: chrome.declarativeNetRequest.Rule[];
    removeRuleIds?: number[];
  }): Promise<void> {
    return await api.declarativeNetRequest.updateDynamicRules(options as any);
  }
};

/**
 * Scripting API
 */
export const scripting = {
  async executeScript<T = any>(options: {
    target: { tabId: number; frameIds?: number[] };
    func: (...args: any[]) => T;
    args?: any[];
  }): Promise<chrome.scripting.InjectionResult<T>[]> {
    return await api.scripting.executeScript(options as any) as any;
  }
};
