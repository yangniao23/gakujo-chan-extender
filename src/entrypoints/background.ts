/**
 * Background Service Worker
 * メッセージリーダー機能のためのURL処理
 */

export default defineBackground(() => {
    // メッセージリーダーからのURL受信処理
    browser.runtime.onMessage.addListener(
        async (message: { url?: string }) => {
            if (message.url) {
                try {
                    // URLにアクセスして既読にする
                    await fetch(message.url);
                    console.log('[Background] Marked as read:', message.url);
                } catch (error) {
                    console.error('[Background] Failed to mark as read:', error);
                }
            }
        }
    );

    console.log('[Background] Service worker initialized');
});
