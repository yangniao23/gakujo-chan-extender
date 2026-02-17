/**
 * 通知メッセージ読み込みのビジネスロジック
 * - テーブルデータの解析
 * - URLの抽出
 * - メッセージ送信処理
 */

import { browser } from 'wxt/browser';
import { TABLE_DATA_START_ROW_INDEX, TABLE_HEADER_ROW_INDEX, RELOAD_DELAY } from '@/core/constants';
import {
    NOTIFICATION_COLUMN_INDEX,
    GAKUJO_BASE_URL,
    URL_PATTERNS,
} from './constants';

/**
 * テーブルからURLを抽出
 */
export function extractUrlsFromTable(table: HTMLTableElement, limit: number): string[] {
    const urls: string[] = [];

    for (let i = TABLE_DATA_START_ROW_INDEX; i <= limit && i < table.rows.length; i++) {
        const row = table.rows[i];
        const cell = row.cells[NOTIFICATION_COLUMN_INDEX.LINK];
        if (!cell) continue;

        const anchor = cell.querySelector('a');
        if (anchor) {
            const href = anchor.getAttribute('href') || '';
            urls.push(GAKUJO_BASE_URL + href.replace(/&amp;/g, '&'));
        }
    }

    return urls;
}

/**
 * 指定数の通知をマークしてリロード
 */
export async function markNotificationsAsRead(
    table: HTMLTableElement,
    readCount: number
): Promise<void> {
    const urls = extractUrlsFromTable(table, readCount);

    for (const url of urls) {
        try {
            await browser.runtime.sendMessage({ url });
            console.log('[MessageReader] Sent URL:', url);
        } catch (error) {
            console.error('[MessageReader] Failed to send message:', error);
        }
    }

    // リロード前の遅延
    setTimeout(() => {
        window.location.reload();
    }, RELOAD_DELAY);
}
