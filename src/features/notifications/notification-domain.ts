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
 * テーブルを2次元配列に変換
 */
export function parseNotificationTable(table: HTMLTableElement): string[][] {
    const result: string[][] = [];

    for (let i = TABLE_DATA_START_ROW_INDEX; i < table.rows.length; i++) {
        result[i] = [];
        const row = table.rows[i];
        for (let j = 0; j < table.rows[TABLE_HEADER_ROW_INDEX].cells.length; j++) {
            result[i][j] = row.cells[j].innerHTML;
        }
    }

    return result;
}

/**
 * HTMLからURLを抽出
 */
export function extractUrlFromHtml(html: string): string {
    // href="..." パターンから抽出
    let url = html.substring(html.indexOf(URL_PATTERNS.HREF_START) + 2);
    url = url.substring(0, url.indexOf(URL_PATTERNS.HREF_END));

    // HTMLエンティティをデコード
    while (url.indexOf(URL_PATTERNS.AMP_ENTITY) !== -1) {
        url = url.replace(URL_PATTERNS.AMP_ENTITY, '');
    }

    return GAKUJO_BASE_URL + url;
}

/**
 * 指定数の通知をマークしてリロード
 */
export async function markNotificationsAsRead(
    table: HTMLTableElement,
    readCount: number
): Promise<void> {
    const tableArray = parseNotificationTable(table);

    // 指定数分だけURLを送信
    for (let i = TABLE_DATA_START_ROW_INDEX; i <= readCount && i < tableArray.length; i++) {
        const url = extractUrlFromHtml(tableArray[i][NOTIFICATION_COLUMN_INDEX.LINK]);
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
