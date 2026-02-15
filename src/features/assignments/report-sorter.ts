/**
 * レポート/課題ソート機能のUI初期化
 * - ソートボタンの生成
 * - イベントリスナーの設定
 */

import { REPORT_TABLE_SELECTOR, TAB_MENU_TABLE_ID, MAIN_IFRAME_SELECTOR } from '@/core/constants';
import { getTableInFrame, waitForElementInFrame, createButton, append } from '@/core/dom';
import {
    SORT_BUTTON_IDS,
    SORT_BUTTON_LABELS,
} from './constants';
import {
    setTempColorBlue,
    sortReportsByDate,
    sortReportsByNumber,
    sortReportsByTitle,
} from './report-domain';


/**
 * ソートボタンを作成
 */
function createSortButtons(table: HTMLTableElement): void {
    const tabMenuTable = document.getElementById(TAB_MENU_TABLE_ID);
    if (!tabMenuTable) {
        console.warn('[Report Sorter] tabmenutable not found');
        return;
    }

    append(
        tabMenuTable,
        createButton(SORT_BUTTON_LABELS.TITLE, () => sortReportsByTitle(table), { id: SORT_BUTTON_IDS.TITLE }),
        createButton(SORT_BUTTON_LABELS.CODE, () => sortReportsByNumber(table), { id: SORT_BUTTON_IDS.CODE }),
        createButton(SORT_BUTTON_LABELS.DATE, () => sortReportsByDate(table), { id: SORT_BUTTON_IDS.DATE })
    );
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
    // テーブルが現れるまで待機
    await waitForElementInFrame(MAIN_IFRAME_SELECTOR, REPORT_TABLE_SELECTOR);

    const table = getTableInFrame(REPORT_TABLE_SELECTOR);
    if (!table) {
        console.error('[Report Sorter] Failed to get report table');
        return;
    }

    createSortButtons(table);
    sortReportsByDate(table); // デフォルトで提出期間ソート（内部でsetTempColorBlueを呼ぶ）
    console.log('[Report Sorter] Initialized');
}

// ページロード時に実行
if (typeof window !== 'undefined') {
    window.addEventListener('load', main);
}
