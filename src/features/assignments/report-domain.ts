/**
 * レポート/課題機能のビジネスロジック
 * - テーブルデータの解析
 * - ソート処理
 * - テーブル表示修飾
 */

import { TABLE_DATA_START_ROW_INDEX, TABLE_HEADER_ROW_INDEX } from '@/core/constants';
import { updateTableRows } from '@/core/dom';
import { getCurrentDateTimeFormatted } from '@/core/utils/date';
import { sortBy } from 'es-toolkit';
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
 * 一時保存の文字を青色に変更
 */
export function setTempColorBlue(table: HTMLTableElement): void {
    for (let i = TABLE_HEADER_ROW_INDEX; i < table.rows.length; i++) {
        const cell = table.rows[i].cells[REPORT_COLUMN_INDEX.STATUS];
        if (!cell) continue;

        const text = cell.textContent || '';
        if (text.match(SUBMISSION_STATUS_PATTERNS.TEMP_SAVED)) {
            const savedText = text.includes('一時保存') ? '一時保存' : 'Temporarily saved';
            cell.style.color = TEMP_SAVED_COLOR;
            cell.textContent = savedText;
        }
    }
}

/**
 * テーブルを配列に変換（メタデータ付き）
 */
export function parseReportTable(table: HTMLTableElement): ReportRow[] {
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
                        .replace(/[\/\s:]/g, '');
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
    const reportArray = parseReportTable(table);
    const now = getCurrentDateTimeFormatted();

    // 期限内と期限切れに分割
    const active = reportArray.filter((row) => row.deadline >= now);
    const expired = reportArray.filter((row) => row.deadline < now);

    // それぞれをソート（締切日時 → 提出状態）
    const sortedActive = sortBy(active, [
        (row) => row.deadline,
        (row) => row.status,
    ]);
    const sortedExpired = sortBy(expired, [
        (row) => row.deadline,
        (row) => row.status,
    ]);

    // 結合して更新
    updateReportTable(table, [...sortedActive, ...sortedExpired]);
    setTempColorBlue(table);
}

/**
 * 開講番号でソート
 */
export function sortReportsByNumber(table: HTMLTableElement): void {
    const reportArray = parseReportTable(table);

    const sorted = sortBy(reportArray, [
        (row) => row.cells[REPORT_COLUMN_INDEX.CONTENT] || '',
    ]);

    updateReportTable(table, sorted);
    setTempColorBlue(table);
}

/**
 * タイトルでソート
 */
export function sortReportsByTitle(table: HTMLTableElement): void {
    const reportArray = parseReportTable(table);

    const sorted = sortBy(reportArray, [
        (row) => row.cells[REPORT_COLUMN_INDEX.TITLE] || '',
    ]);

    updateReportTable(table, sorted);
    setTempColorBlue(table);
}
