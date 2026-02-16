/**
 * Background Service Worker
 * - メッセージリーダー機能のためのURL処理
 * - PDF強制ダウンロード防止処理 (declarativeNetRequest)
 */

export default defineBackground(() => {
    // PDFの強制ダウンロードを防止する動的ルールの設定
    const setupPdfInlineRules = async () => {
        const ruleId = 1;
        const rule = {
            id: ruleId,
            priority: 1,
            action: {
                type: 'modifyHeaders',
                responseHeaders: [
                    {
                        header: 'Content-Disposition',
                        operation: 'set',
                        value: 'inline',
                    },
                ],
            },
            condition: {
                urlFilter: '|https://gakujo.iess.niigata-u.ac.jp/campusweb/*',
                resourceTypes: [
                    'main_frame',
                    'sub_frame',
                ] as chrome.declarativeNetRequest.ResourceType[],
            },
        };

        try {
            await browser.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [ruleId],
                addRules: [rule as chrome.declarativeNetRequest.Rule],
            });
            console.log('[Background] PDF inline rule registered');
        } catch (error) {
            console.error('[Background] Failed to register PDF inline rule:', error);
        }
    };

    // 初期化時にルールを設定
    setupPdfInlineRules();

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
