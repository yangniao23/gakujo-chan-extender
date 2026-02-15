/**
 * レポート/課題ソート機能のUI初期化
 * - ソートボタンの生成
 * - イベントリスナーの設定
 */

import { REPORT_TABLE_SELECTOR, TAB_MENU_TABLE_ID, MAIN_IFRAME_SELECTOR } from '@/core/constants';
import { getTableInFrame, waitForElementInFrame } from '@/core/dom';
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

    // タイトルでソートボタン
    const titleButton = document.createElement('button');
    titleButton.id = SORT_BUTTON_IDS.TITLE;
    titleButton.textContent = SORT_BUTTON_LABELS.TITLE;
    titleButton.addEventListener('click', () => sortReportsByTitle(table));

    // 開講番号でソートボタン
    const numberButton = document.createElement('button');
    numberButton.id = SORT_BUTTON_IDS.CODE;
    numberButton.textContent = SORT_BUTTON_LABELS.CODE;
    numberButton.addEventListener('click', () => sortReportsByNumber(table));

    // 提出期間でソートボタン
    const dateButton = document.createElement('button');
    dateButton.id = SORT_BUTTON_IDS.DATE;
    dateButton.textContent = SORT_BUTTON_LABELS.DATE;
    dateButton.addEventListener('click', () => sortReportsByDate(table));

    // ボタンを追加
    tabMenuTable.appendChild(titleButton);
    tabMenuTable.appendChild(numberButton);
    tabMenuTable.appendChild(dateButton);
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

    setTempColorBlue(table);
    createSortButtons(table);
    sortReportsByDate(table); // デフォルトで提出期間ソート
    console.log('[Report Sorter] Initialized');
}

// ページロード時に実行
if (typeof window !== 'undefined') {
    window.addEventListener('load', main);
}
