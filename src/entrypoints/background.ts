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
        // ID 2番以降を使用（一時的なルール）
        const ruleId = Math.floor(Math.random() * 1000) + 10; 
        
        // ファイル名に拡張子がない場合は補完
        const finalFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;

        const rule = {
            id: ruleId,
            priority: 2, // デフォルトルール(priority 1)より優先
            action: {
                type: 'modifyHeaders',
                responseHeaders: [
                    {
                        header: 'Content-Disposition',
                        operation: 'set',
                        value: `inline; filename="${encodeURIComponent(finalFilename)}"`,
                    },
                ],
            },
            condition: {
                urlFilter: url.split('?')[0], // クエリを除いた部分でマッチングを試みる
                resourceTypes: ['main_frame', 'sub_frame'] as browser.declarativeNetRequest.ResourceType[],
            },
        };

        try {
            await browser.declarativeNetRequest.updateDynamicRules({
                addRules: [rule as browser.declarativeNetRequest.Rule],
            });
            console.log(`[Background] Specific rule registered for ${finalFilename}`);
            
            // 30秒後にルールを削除（リクエスト完了後には不要なため）
            setTimeout(async () => {
                await browser.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [ruleId],
                });
            }, 30000);
        } catch (error) {
            console.warn('[Background] Failed to register specific PDF rule:', error);
        }
    };

    // 初期化時にデフォルトルールを設定
    setupPdfInlineRules();

    // メッセージリスナー
    browser.runtime.onMessage.addListener(
        (message: { type?: string; url?: string; filename?: string }) => {
            if (message.type === 'PREPARE_PDF' && message.url && message.filename) {
                registerSpecificPdfRule(message.url, message.filename);
                return;
            }

            if (message.url) {
                // 既存の既読処理
                fetch(message.url).catch(err => console.error(err));
            }
        }
    );

    console.log('[Background] Service worker initialized');
});
