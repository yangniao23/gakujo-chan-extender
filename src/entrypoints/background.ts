/**
 * Background Service Worker
 * - メッセージリーダー機能のためのURL処理
 * - PDF強制ダウンロード防止処理 (declarativeNetRequest)
 * - PDFタブタイトルの書き換え (scripting)
 */

import { browser } from 'wxt/browser';

export default defineBackground(() => {
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
            // 1. ルール登録
            await browser.declarativeNetRequest.updateDynamicRules({
                addRules: [rule],
            });

            // 2. タブを開く
            const tab = await browser.tabs.create({ url });
            console.log(`[Background] Tab created: ${tab.id} for ${finalFilename}`);

            // 3. 読み込み完了を待機してタイトルを書き換える
            const listener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    browser.tabs.onUpdated.removeListener(listener);
                    
                    // タイトル書き換えスクリプトの実行
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
                    }).catch(err => console.warn('[Background] Script injection failed:', err));
                }
            };
            browser.tabs.onUpdated.addListener(listener);

            // 4. ルールの後片付け
            setTimeout(() => {
                browser.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [ruleId],
                }).catch(() => {});
            }, 60000);
            
            return true;
        } catch (error) {
            console.error('[Background] Failed to open PDF with title:', error);
            return false;
        }
    };

    // 初期化時にデフォルトルールを設定
    setupPdfInlineRules();

    // メッセージリスナー
    browser.runtime.onMessage.addListener(
        (message: { type?: string; url?: string; filename?: string }, sender, sendResponse) => {
            if (message.type === 'OPEN_PDF' && message.url && message.filename) {
                openPdfWithCorrectTitle(message.url, message.filename).then(success => {
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
