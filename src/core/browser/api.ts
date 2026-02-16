/**
 * ブラウザAPI統一レイヤー
 * Chrome/Firefox両対応
 */

/**
 * Runtime API
 */
export const runtime = {
  getManifest() {
    if (typeof browser !== 'undefined') return browser.runtime.getManifest();
    return chrome.runtime.getManifest();
  },

  sendMessage<T = any>(message: any): Promise<T> {
    if (typeof browser !== 'undefined') return browser.runtime.sendMessage(message);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => resolve(response));
    });
  },

  onMessage: {
    addListener(
      callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void | boolean
    ) {
      if (typeof browser !== 'undefined') {
        browser.runtime.onMessage.addListener(callback);
      } else {
        chrome.runtime.onMessage.addListener(callback);
      }
    },
  },
};

/**
 * Storage API
 */
export const storage = {
  async get<T = any>(key: string): Promise<T | undefined> {
    if (typeof browser !== 'undefined') {
      const result = await browser.storage.local.get(key);
      return result[key] as T;
    }
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => resolve(result[key] as T));
    });
  },

  async set(key: string, value: any): Promise<void> {
    if (typeof browser !== 'undefined') {
      return await browser.storage.local.set({ [key]: value });
    }
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    });
  },
};

/**
 * Tabs API
 */
export const tabs = {
  async create(options: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab> {
    if (typeof browser !== 'undefined') {
      return await browser.tabs.create(options as any) as any;
    }
    return new Promise((resolve) => {
      chrome.tabs.create(options, (tab) => resolve(tab));
    });
  },

  async remove(tabId: number): Promise<void> {
    if (typeof browser !== 'undefined') {
      return await browser.tabs.remove(tabId);
    }
    return new Promise((resolve) => {
      chrome.tabs.remove(tabId, () => resolve());
    });
  },

  onUpdated: {
    addListener(
      callback: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void
    ) {
      if (typeof browser !== 'undefined') {
        browser.tabs.onUpdated.addListener(callback);
      } else {
        chrome.tabs.onUpdated.addListener(callback);
      }
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
    if (typeof browser !== 'undefined') {
      return await (browser as any).declarativeNetRequest.updateDynamicRules(options);
    }
    return new Promise((resolve) => {
      chrome.declarativeNetRequest.updateDynamicRules(options, () => resolve());
    });
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
    if (typeof browser !== 'undefined') {
      return await (browser as any).scripting.executeScript(options as any);
    }
    return new Promise((resolve) => {
      chrome.scripting.executeScript(options as any, (results) => resolve(results as any));
    });
  }
};
