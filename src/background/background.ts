/**
 * Background script
 * メッセージリーダーからのタブ自動化リクエストを処理
 */

import { runtime, tabs } from '@/core/browser/api';

interface TabAutomationMessage {
  url: string;
}

/**
 * タブ自動化メッセージハンドラー
 */
async function handleTabAutomation(message: TabAutomationMessage): Promise<void> {
  // 学情のURLであることを確認
  if (!message.url || message.url.indexOf('campusweb/') <= 0) {
    console.warn('[Background] Invalid URL received:', message.url);
    return;
  }

  try {
    // バックグラウンドでタブを開く
    const tab = await tabs.create({
      url: message.url,
      active: false, // アクティブにしない
    });

    // 1秒後にタブを閉じる
    setTimeout(async () => {
      if (tab.id) {
        await tabs.remove(tab.id);
      }
    }, 1000);

    console.log('[Background] Tab automation completed for:', message.url);
  } catch (error) {
    console.error('[Background] Tab automation failed:', error);
  }
}

/**
 * メッセージリスナーを初期化
 */
function initMessageListener(): void {
  runtime.onMessage.addListener((message: unknown) => {
    const msg = message as TabAutomationMessage;
    if (msg.url) {
      handleTabAutomation(msg);
    }
  });

  console.log('[Background] Message listener initialized');
}

// 初期化
initMessageListener();
