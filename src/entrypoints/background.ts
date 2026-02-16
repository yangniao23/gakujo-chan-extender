/**
 * Background Service Worker
 * - メッセージリーダー機能のためのURL処理
 * - PDF強制ダウンロード防止処理 (declarativeNetRequest)
 * - PDFタブタイトルの書き換え (scripting)
 */

import { runtime, tabs, declarativeNetRequest, scripting } from '@/core/browser/api';

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
            await declarativeNetRequest.updateDynamicRules({
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
            await declarativeNetRequest.updateDynamicRules({
                addRules: [rule],
            });
            console.log(`[Background] Rule registered: ${finalFilename} for ${url}`);
            
            setTimeout(() => {
                declarativeNetRequest.updateDynamicRules({
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
    tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.url) {
            const title = pendingTitles.get(tab.url);
            if (title) {
                try {
                    await scripting.executeScript({
                        target: { tabId },
                        func: (newTitle: string) => {
                            // タイトルを設定
                            document.title = newTitle;

                            // 以降の書き換えを監視して阻止する
                            const observer = new MutationObserver(() => {
                                if (document.title !== newTitle) {
                                    document.title = newTitle;
                                }
                            });

                            observer.observe(document.documentElement, {
                                childList: true,
                                subtree: true,
                                characterData: true
                            });

                            // タイトル要素自体も直接監視（存在する場合）
                            const titleEl = document.querySelector('title');
                            if (titleEl) {
                                observer.observe(titleEl, { characterData: true, childList: true });
                            }
                        },
                        args: [title],
                    });
                    console.log(`[Background] Title override observer started: ${title}`);
                    // 一度適用したら削除
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
    runtime.onMessage.addListener(
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
