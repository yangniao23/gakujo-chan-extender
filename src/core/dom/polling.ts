/**
 * ポーリング（要素出現待機）ユーティリティ
 */

import { LOAD_CHECK_INTERVAL, MAX_POLLING_ATTEMPTS } from '@/core/constants';
import { PollingConfig } from '@/core/types';
import { getFrameDocument } from './iframe-helper';

/**
 * 指定された条件を満たすまで定期的にチェック
 * @param checkFn チェック関数（条件が満たされたらtrueを返す）
 * @param config ポーリング設定
 * @returns チェック関数の実行結果の型
 */
export async function pollUntil<T>(
    checkFn: () => T | null,
    config: Partial<PollingConfig> = {}
): Promise<T | null> {
    const interval = config.interval ?? LOAD_CHECK_INTERVAL;
    const maxAttempts = config.maxAttempts ?? MAX_POLLING_ATTEMPTS;

    return new Promise((resolve) => {
        let attempts = 0;

        const timer = setInterval(() => {
            attempts++;
            const result = checkFn();

            if (result) {
                clearInterval(timer);
                resolve(result);
            } else if (attempts >= maxAttempts) {
                clearInterval(timer);
                console.warn('[Polling] Max attempts exceeded, timeout');
                if (config.onTimeout) {
                    config.onTimeout();
                }
                resolve(null);
            }
        }, interval);
    });
}

/**
 * iframe内のセレクタの要素が出現するまで待機
 * @param iframeSelector iframe自体のセレクタ
 * @param elementSelector iframe内の要素のセレクタ
 * @param config ポーリング設定
 * @returns 見つかった要素、またはタイムアウトの場合はnull
 */
export async function waitForElementInFrame(
    iframeSelector: string,
    elementSelector: string,
    config: Partial<PollingConfig> = {}
): Promise<Element | null> {
    return pollUntil(() => {
        const iframe = document.querySelector(iframeSelector) as HTMLIFrameElement;
        if (!iframe?.contentWindow?.document) {
            return null;
        }
        return iframe.contentWindow.document.querySelector(elementSelector);
    }, config);
}

/**
 * 即座にpollUntilを実行（同期的に）
 * ページロード時などのイベントリスナー内で使用
 * @param checkFn チェック関数
 * @param config ポーリング設定
 */
export function startPolling(
    checkFn: () => void,
    config: Partial<PollingConfig> = {}
): void {
    const interval = config.interval ?? LOAD_CHECK_INTERVAL;
    const maxAttempts = config.maxAttempts ?? MAX_POLLING_ATTEMPTS;

    let attempts = 0;
    const timer = setInterval(() => {
        attempts++;
        try {
            checkFn();
        } catch (error) {
            if (attempts >= maxAttempts) {
                clearInterval(timer);
                console.error('[Polling] Error during polling:', error);
                if (config.onTimeout) {
                    config.onTimeout();
                }
            }
        }
    }, interval);
}
