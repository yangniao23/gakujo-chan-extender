/**
 * レポート/課題ソート機能
 * - 提出期限でソート
 * - タイトルでソート
 * - 開講番号でソート
 * - 一時保存を青字表示
 */

import { REPORT_TABLE_SELECTOR, TAB_MENU_TABLE_ID, MAIN_IFRAME_SELECTOR } from '@/core/constants';
import { getTableInFrame, updateTableRows, waitForElementInFrame } from '@/core/dom';
import {
    REPORT_COLUMN_INDEX,
    SubmissionStatus,
    SUBMISSION_STATUS_PATTERNS,
    TEMP_SAVED_COLOR,
    SORT_BUTTON_IDS,
    SORT_BUTTON_LABELS,
} from './constants';

interface ReportRow {
    cells: string[];
    status: SubmissionStatus;
    deadline: string; // YYYYMMDDHHmm形式
}

/**
 * iframe内のレポート一覧テーブルを取得
 */
function getReportTable(): HTMLTableElement | null {
    return getTableInFrame(REPORT_TABLE_SELECTOR);
}

/**
 * 現在日時をYYYYMMDDHHmm形式で取得
 */
function getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${date}${hour}${min}`;
}

/**
 * 一時保存の文字を青色に変更
 */
function setTempColorBlue(table: HTMLTableElement): void {
    for (let i = 0; i < table.rows.length; i++) {
        const cell = table.rows[i].cells[REPORT_COLUMN_INDEX.STATUS];
        if (!cell) continue;

        const text = cell.textContent || '';
        if (text.match(SUBMISSION_STATUS_PATTERNS.TEMP_SAVED)) {
            const savedText = text.includes('一時保存') ? '一時保存' : 'Temporarily saved';
            cell.innerHTML = `<font color="${TEMP_SAVED_COLOR}">${savedText}</font>`;
        }
    }
}

/**
 * テーブルを配列に変換（メタデータ付き）
 */
function tableToReportArray(table: HTMLTableElement): ReportRow[] {
    const now = getCurrentDateTime();
    const rows: ReportRow[] = [];
    const colCount = table.rows[0].cells.length;

    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cells: string[] = [];
        let status: SubmissionStatus = SubmissionStatus.NOT_SUBMITTED;
        let deadline = '';

        for (let j = 0; j < colCount; j++) {
            const cell = row.cells[j];
            cells[j] = cell.innerHTML;

            // 提出状態を判定
            if (j === REPORT_COLUMN_INDEX.STATUS) {
                const text = cell.textContent || '';
                if (text.match(SUBMISSION_STATUS_PATTERNS.NOT_SUBMITTED)) {
                    status = SubmissionStatus.NOT_SUBMITTED;
                } else if (text.match(SUBMISSION_STATUS_PATTERNS.TEMP_SAVED)) {
                    status = SubmissionStatus.TEMP_SAVED;
                } else if (text.match(SUBMISSION_STATUS_PATTERNS.SUBMITTED)) {
                    status = SubmissionStatus.SUBMITTED;
                }
            }

            // 締切日時を抽出
            if (j === REPORT_COLUMN_INDEX.PERIOD) {
                const text = cell.textContent || '';
                const tildaIndex = text.indexOf('～');
                if (tildaIndex !== -1) {
                    deadline = text
                        .substring(tildaIndex + 1)
                        .replace(/\//g, '')
                        .replace(/:/g, '')
                        .replace(/\s/g, '');
                }
            }
        }

        rows.push({ cells, status, deadline });
    }

    return rows;
}

/**
 * ソートされた配列でテーブルを更新
 */
function updateTable(table: HTMLTableElement, rows: ReportRow[]): void {
    const htmlRows = rows.map((row) => row.cells);
    updateTableRows(table, htmlRows);
}

/**
 * 提出期間でソート
 */
function sortByDate(): void {
    const table = getReportTable();
    if (!table) return;

    setTempColorBlue(table);
    const reportArray = tableToReportArray(table);
    const now = getCurrentDateTime();

    // 期限内と期限切れに分割
    const active = reportArray.filter((row) => row.deadline >= now);
    const expired = reportArray.filter((row) => row.deadline < now);

    // それぞれをソート（締切日時 → 提出状態）
    const sortByDeadlineAndStatus = (a: ReportRow, b: ReportRow) => {
        const deadlineDiff = parseInt(a.deadline) - parseInt(b.deadline);
        if (deadlineDiff !== 0) return deadlineDiff;
        return a.status - b.status;
    };

    active.sort(sortByDeadlineAndStatus);
    expired.sort(sortByDeadlineAndStatus);

    // 結合して更新
    updateTable(table, [...active, ...expired]);
}

/**
 * 開講番号でソート
 */
function sortByNumber(): void {
    const table = getReportTable();
    if (!table) return;

    setTempColorBlue(table);
    const reportArray = tableToReportArray(table);

    // 開講番号でソート
    reportArray.sort((a, b) => {
        const aNum = a.cells[REPORT_COLUMN_INDEX.CONTENT] || '';
        const bNum = b.cells[REPORT_COLUMN_INDEX.CONTENT] || '';
        if (aNum < bNum) return -1;
        if (aNum > bNum) return 1;
        return 0;
    });

    updateTable(table, reportArray);
}

/**
 * タイトルでソート
 */
function sortByTitle(): void {
    const table = getReportTable();
    if (!table) return;

    setTempColorBlue(table);
    const reportArray = tableToReportArray(table);

    // タイトルでソート
    reportArray.sort((a, b) => {
        const aTitle = a.cells[REPORT_COLUMN_INDEX.TITLE] || '';
        const bTitle = b.cells[REPORT_COLUMN_INDEX.TITLE] || '';
        if (aTitle < bTitle) return -1;
        if (aTitle > bTitle) return 1;
        return 0;
    });

    updateTable(table, reportArray);
}

/**
 * ソートボタンを作成
 */
function createSortButtons(): void {
    const tabMenuTable = document.getElementById(TAB_MENU_TABLE_ID);
    if (!tabMenuTable) {
        console.warn('[Report Sorter] tabmenutable not found');
        return;
    }

    // タイトルでソートボタン
    const titleButton = document.createElement('button');
    titleButton.id = SORT_BUTTON_IDS.TITLE;
    titleButton.textContent = SORT_BUTTON_LABELS.TITLE;
    titleButton.addEventListener('click', sortByTitle);

    // 開講番号でソートボタン
    const numberButton = document.createElement('button');
    numberButton.id = SORT_BUTTON_IDS.CODE;
    numberButton.textContent = SORT_BUTTON_LABELS.CODE;
    numberButton.addEventListener('click', sortByNumber);

    // 提出期間でソートボタン
    const dateButton = document.createElement('button');
    dateButton.id = SORT_BUTTON_IDS.DATE;
    dateButton.textContent = SORT_BUTTON_LABELS.DATE;
    dateButton.addEventListener('click', sortByDate);

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

    const table = getReportTable();
    if (!table) {
        console.error('[Report Sorter] Failed to get report table');
        return;
    }

    setTempColorBlue(table);
    createSortButtons();
    sortByDate(); // デフォルトで提出期間ソート
    console.log('[Report Sorter] Initialized');
}

// ページロード時に実行
if (typeof window !== 'undefined') {
    window.addEventListener('load', main);
}
