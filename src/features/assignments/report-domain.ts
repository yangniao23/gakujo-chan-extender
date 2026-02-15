/**
 * レポート/課題機能のビジネスロジック
 * - テーブルデータの解析
 * - ソート処理
 * - テーブル表示修飾
 */

import { TABLE_DATA_START_ROW_INDEX, TABLE_HEADER_ROW_INDEX } from '@/core/constants';
import { updateTableRows } from '@/core/dom';
import {
    REPORT_COLUMN_INDEX,
    SubmissionStatus,
    SUBMISSION_STATUS_PATTERNS,
    TEMP_SAVED_COLOR,
} from './constants';

/**
 * レポート行のデータ構造
 */
export interface ReportRow {
    cells: string[];
    status: SubmissionStatus;
    deadline: string; // YYYYMMDDHHmm形式
}

/**
 * 現在日時をYYYYMMDDHHmm形式で取得
 */
export function getCurrentDateTime(): string {
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
export function setTempColorBlue(table: HTMLTableElement): void {
    for (let i = TABLE_HEADER_ROW_INDEX; i < table.rows.length; i++) {
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
export function parseReportTable(table: HTMLTableElement): ReportRow[] {
    const now = getCurrentDateTime();
    const rows: ReportRow[] = [];
    const colCount = table.rows[TABLE_HEADER_ROW_INDEX].cells.length;

    for (let i = TABLE_DATA_START_ROW_INDEX; i < table.rows.length; i++) {
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
export function updateReportTable(table: HTMLTableElement, rows: ReportRow[]): void {
    const htmlRows = rows.map((row) => row.cells);
    updateTableRows(table, htmlRows);
}

/**
 * 提出期間でソート
 */
export function sortReportsByDate(table: HTMLTableElement): void {
    setTempColorBlue(table);
    const reportArray = parseReportTable(table);
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
    updateReportTable(table, [...active, ...expired]);
}

/**
 * 開講番号でソート
 */
export function sortReportsByNumber(table: HTMLTableElement): void {
    setTempColorBlue(table);
    const reportArray = parseReportTable(table);

    // 開講番号でソート
    reportArray.sort((a, b) => {
        const aNum = a.cells[REPORT_COLUMN_INDEX.CONTENT] || '';
        const bNum = b.cells[REPORT_COLUMN_INDEX.CONTENT] || '';
        if (aNum < bNum) return -1;
        if (aNum > bNum) return 1;
        return 0;
    });

    updateReportTable(table, reportArray);
}

/**
 * タイトルでソート
 */
export function sortReportsByTitle(table: HTMLTableElement): void {
    setTempColorBlue(table);
    const reportArray = parseReportTable(table);

    // タイトルでソート
    reportArray.sort((a, b) => {
        const aTitle = a.cells[REPORT_COLUMN_INDEX.TITLE] || '';
        const bTitle = b.cells[REPORT_COLUMN_INDEX.TITLE] || '';
        if (aTitle < bTitle) return -1;
        if (aTitle > bTitle) return 1;
        return 0;
    });

    updateReportTable(table, reportArray);
}
