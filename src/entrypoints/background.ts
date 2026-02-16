/**
 * Background Service Worker
 * - メッセージリーダー機能のためのURL処理
 * - PDF強制ダウンロード防止処理 (declarativeNetRequest)
 * - PDFタブタイトルの書き換え (scripting)
 */

import { browser } from 'wxt/browser';

export default defineBackground(() => {
    // URLとファイル名のマッピングを保持
    const pendingTitles = new Map<string, string>();

    // PDFの強制ダウンロードを防止する動的ルールの設定
    const setupPdfInlineRules = async () => {
        const ruleId = 1;
        const rule: chrome.declarativeNetRequest.Rule = {
            id: ruleId,
            priority: 1,
            action: {
                type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
                responseHeaders: [
                    {
                        header: 'Content-Disposition',
                        operation: 'set' as chrome.declarativeNetRequest.HeaderOperation,
                        value: 'inline',
                    },
                ],
            },
            condition: {
                urlFilter: '|https://gakujo.iess.niigata-u.ac.jp/campusweb/*',
                resourceTypes: [
                    'main_frame' as chrome.declarativeNetRequest.ResourceType,
                    'sub_frame' as chrome.declarativeNetRequest.ResourceType,
                ],
            },
        };

        try {
            await browser.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [ruleId],
                addRules: [rule],
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

        // タイトル書き換え用に保存
        pendingTitles.set(url, finalFilename);

        const dispositionValue = `inline; filename="${encodeURIComponent(finalFilename)}"; filename*=UTF-8''${encodeURIComponent(finalFilename)}`;

        const rule: chrome.declarativeNetRequest.Rule = {
            id: ruleId,
            priority: 10,
            action: {
                type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
                responseHeaders: [
                    {
                        header: 'Content-Disposition',
                        operation: 'set' as chrome.declarativeNetRequest.HeaderOperation,
                        value: dispositionValue,
                    },
                ],
            },
            condition: {
                urlFilter: url.split('#')[0], 
                resourceTypes: [
                    'main_frame' as chrome.declarativeNetRequest.ResourceType,
                    'sub_frame' as chrome.declarativeNetRequest.ResourceType,
                ],
            },
        };

        try {
            await browser.declarativeNetRequest.updateDynamicRules({
                addRules: [rule],
            });
            console.log(`[Background] Rule registered: ${finalFilename} for ${url}`);
            
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

    // タブが更新されたときにタイトルを書き換える
    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.url) {
            const title = pendingTitles.get(tab.url);
            if (title) {
                try {
                    // ChromeのPDFビューア対策: 完了直後だと上書きされるため少し待機して実行
                    await browser.scripting.executeScript({
                        target: { tabId },
                        func: (newTitle: string) => {
                            const applyTitle = () => {
                                if (document.title !== newTitle) {
                                    document.title = newTitle;
                                }
                            };

                            // 1. 即座に適用試行
                            applyTitle();

                            // 2. MutationObserverで監視
                            const observer = new MutationObserver(applyTitle);
                            observer.observe(document.documentElement, {
                                childList: true,
                                subtree: true,
                                characterData: true
                            });

                            // 3. Chromeの強力な上書き対策: 最初の数秒間は定期的に強制上書き
                            let count = 0;
                            const interval = setInterval(() => {
                                applyTitle();
                                if (count++ > 10) clearInterval(interval); // 300ms * 10 = 3秒程度
                            }, 300);
                        },
                        args: [title],
                    });
                    console.log(`[Background] Title override sequence started: ${title}`);
                    pendingTitles.delete(tab.url);
                } catch (error) {
                    console.warn('[Background] Failed to override title:', error);
                }
            }
        }
    });

    // 初期化時にデフォルトルールを設定
    setupPdfInlineRules();

    // メッセージリスナー
    browser.runtime.onMessage.addListener(
        (message: { type?: string; url?: string; filename?: string }, sender, sendResponse) => {
            if (message.type === 'PREPARE_PDF' && message.url && message.filename) {
                registerSpecificPdfRule(message.url, message.filename).then(success => {
                    sendResponse({ success });
                });
                return true; 
            }

            if (message.url) {
                fetch(message.url).catch(err => console.error(err));
            }
        }
    );

    console.log('[Background] Service worker initialized');
});
