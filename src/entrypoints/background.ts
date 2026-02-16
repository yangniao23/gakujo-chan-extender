/**
 * Background Service Worker
 * - メッセージリーダー機能のためのURL処理
 * - PDF強制ダウンロード防止処理 (declarativeNetRequest)
 * - PDFタブタイトルの書き換え (scripting)
 */

import { browser } from 'wxt/browser';

export default defineBackground(() => {
    console.log('[Background] Service worker started');

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

    // 特定のURLに対してファイル名を指定してルールを上書きし、タブを開く
    const openPdfWithCorrectTitle = async (url: string, filename: string) => {
        console.log(`[Background] Starting openPdfWithCorrectTitle for: ${filename}`);
        const ruleId = Math.floor(Math.random() * 10000) + 100;
        const finalFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
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
                resourceTypes: ['main_frame' as chrome.declarativeNetRequest.ResourceType],
            },
        };

        try {
            console.log(`[Background] Registering dynamic rule for ${finalFilename}...`);
            await browser.declarativeNetRequest.updateDynamicRules({
                addRules: [rule],
            });

            // 2. リスナーを先に登録して、イベントを取り逃がさないようにする
            // 将来的にタブIDが確定してからフィルタリングする
            let targetTabId: number | undefined;
            const listener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
                if (targetTabId !== undefined && tabId === targetTabId) {
                    console.log(`[Background] Tab ${tabId} updated: status=${changeInfo.status}`);
                    if (changeInfo.status === 'complete') {
                        browser.tabs.onUpdated.removeListener(listener);
                        console.log(`[Background] Tab ${tabId} load complete. Injecting title script...`);
                        
                        browser.scripting.executeScript({
                            target: { tabId },
                            func: (newTitle: string) => {
                                const applyTitle = () => {
                                    if (document.title !== newTitle) {
                                        document.title = newTitle;
                                    }
                                };
                                applyTitle();
                                const observer = new MutationObserver(applyTitle);
                                observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
                                let count = 0;
                                const interval = setInterval(() => {
                                    applyTitle();
                                    if (count++ > 15) clearInterval(interval);
                                }, 200);
                            },
                            args: [finalFilename],
                        }).then(() => {
                            console.log(`[Background] Title script injected successfully for tab ${tabId}`);
                        }).catch(err => console.warn('[Background] Script injection failed:', err));
                    }
                }
            };
            browser.tabs.onUpdated.addListener(listener);

            console.log(`[Background] Creating tab for ${url}...`);
            const tab = await browser.tabs.create({ url });
            targetTabId = tab.id; // ここでIDを確定させる
            console.log(`[Background] Tab created: ID=${tab.id}`);

            setTimeout(() => {
                console.log(`[Background] Removing temporary rule ${ruleId}`);
                browser.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [ruleId],
                }).catch(() => {});
                // 念のためタイムアウトでリスナーも解除
                browser.tabs.onUpdated.removeListener(listener);
            }, 60000);
            
            return true;
        } catch (error) {
            console.error('[Background] Failed to open PDF with title:', error);
            return false;
        }
    };

    // 初期化
    setupPdfInlineRules();

    // メッセージリスナー
    browser.runtime.onMessage.addListener(
        (message: { type?: string; url?: string; filename?: string }, sender, sendResponse) => {
            console.log('[Background] Message received:', message.type, message.url);
            
            if (message.type === 'OPEN_PDF' && message.url && message.filename) {
                console.log('[Background] Handling OPEN_PDF request');
                openPdfWithCorrectTitle(message.url, message.filename).then(success => {
                    sendResponse({ success });
                });
                return true; 
            }

            if (message.url) {
                console.log('[Background] Handling URL fetch request (message.url)');
                fetch(message.url).catch(err => console.error(err));
            }
        }
    );

    console.log('[Background] Event listeners initialized');
});
