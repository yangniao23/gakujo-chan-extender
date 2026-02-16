import { browser } from 'wxt/browser';

/**
 * Runtime API
 */
export const runtime = {
  getManifest: () => browser.runtime.getManifest(),
  sendMessage: (message: any) => browser.runtime.sendMessage(message),
  onMessage: {
    addListener: (callback: any) => browser.runtime.onMessage.addListener(callback),
  },
};

/**
 * Storage API
 */
export const storage = {
  async get<T = any>(key: string): Promise<T | undefined> {
    const result = await browser.storage.local.get(key);
    return result[key] as T;
  },
  set: (key: string, value: any) => browser.storage.local.set({ [key]: value }),
};

/**
 * Tabs API
 */
export const tabs = {
  create: (options: any) => browser.tabs.create(options),
  remove: (tabId: number) => browser.tabs.remove(tabId),
  onUpdated: {
    addListener: (callback: any) => browser.tabs.onUpdated.addListener(callback),
  },
};

/**
 * DeclarativeNetRequest API
 */
export const declarativeNetRequest = {
  updateDynamicRules: (options: any) => (browser as any).declarativeNetRequest.updateDynamicRules(options),
};

/**
 * Scripting API
 */
export const scripting = {
  executeScript: (options: any) => (browser as any).scripting.executeScript(options),
};
