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
                ] as browser.declarativeNetRequest.ResourceType[],
            },
        };

        try {
            await browser.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [ruleId],
                addRules: [rule as browser.declarativeNetRequest.Rule],
            });
            console.log('[Background] Default PDF inline rule registered');
        } catch (error) {
            console.error('[Background] Failed to register PDF inline rule:', error);
        }
    };

    // 特定のURLに対してファイル名を指定してルールを上書き
    const registerSpecificPdfRule = async (url: string, filename: string) => {
        const ruleId = Math.floor(Math.random() * 10000) + 100;
        const finalFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;

        // RFC 6266 に準拠した filename* の指定（日本語対応を強化）
        const dispositionValue = `inline; filename="${encodeURIComponent(finalFilename)}"; filename*=UTF-8''${encodeURIComponent(finalFilename)}`;

        const rule = {
            id: ruleId,
            priority: 10, // デフォルトより大幅に高くする
            action: {
                type: 'modifyHeaders',
                responseHeaders: [
                    {
                        header: 'Content-Disposition',
                        operation: 'set',
                        value: dispositionValue,
                    },
                ],
            },
            condition: {
                // 完全一致を狙うために urlFilter を工夫
                urlFilter: url.split('#')[0], 
                resourceTypes: ['main_frame', 'sub_frame'] as browser.declarativeNetRequest.ResourceType[],
            },
        };

        try {
            await browser.declarativeNetRequest.updateDynamicRules({
                addRules: [rule as browser.declarativeNetRequest.Rule],
            });
            console.log(`[Background] Rule registered: ${finalFilename} for ${url}`);
            
            // リクエスト完了後にルールを削除
            setTimeout(() => {
                browser.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [ruleId],
                }).catch(() => {});
            }, 60000);
            
            return true;
        } catch (error) {
            console.error('[Background] Rule registration failed:', error);
            return false;
        }
    };

    // 初期化時にデフォルトルールを設定
    setupPdfInlineRules();

    // メッセージリスナー
    browser.runtime.onMessage.addListener(
        (message: { type?: string; url?: string; filename?: string }, sender, sendResponse) => {
            if (message.type === 'PREPARE_PDF' && message.url && message.filename) {
                registerSpecificPdfRule(message.url, message.filename).then(success => {
                    sendResponse({ success });
                });
                return true; // 非同期応答を許可
            }

            if (message.url) {
                fetch(message.url).catch(err => console.error(err));
            }
        }
    );

    console.log('[Background] Service worker initialized');
});
