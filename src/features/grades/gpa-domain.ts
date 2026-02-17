/**
 * GPA計算・成績分析のビジネスロジック
 * - GPA計算
 * - テーブルデータの解析
 * - ソート処理
 */

import { TABLE_DATA_START_ROW_INDEX, TABLE_HEADER_ROW_INDEX } from '@/core/constants';
import { reorderTableRows } from '@/core/dom';
import { sortBy, sum } from 'es-toolkit';
import {
    GRADE_COLUMN_INDEX,
    GPA_DECIMAL_PLACES,
} from './constants';

/**
 * 成績行のデータ構造
 */
export interface GradeRow {
    element: HTMLTableRowElement;
    no: number;
    openingNumber: string;
    score: number;
    credits: number;
    gp: number;
}

/**
 * GPAを計算
 */
export function calculateGpa(table: HTMLTableElement): number {
    const data: { gpCredit: number; credit: number }[] = [];

    for (let i = TABLE_DATA_START_ROW_INDEX; i < table.rows.length; i++) {
        const row = table.rows[i];
        const gpText = row.cells[GRADE_COLUMN_INDEX.GP]?.textContent || '';
        const creditText = row.cells[GRADE_COLUMN_INDEX.CREDITS]?.textContent || '';

        // GPの値が数字を含む場合のみ計算
        if (gpText.match(/[0-9]/)) {
            const gp = parseFloat(gpText) || 0;
            const credit = parseFloat(creditText) || 0;

            data.push({ gpCredit: gp * credit, credit });
        }
    }

    const gpSum = sum(data.map(d => d.gpCredit));
    const creditSum = sum(data.map(d => d.credit));

    return creditSum > 0 ? gpSum / creditSum : 0;
}

/**
 * GPAヘッダーをフォーマット
 */
export function formatGpaHeader(headerText: string, gpa: number): string {
    return `${headerText}\n GPA:${gpa.toFixed(GPA_DECIMAL_PLACES)}`;
}

/**
 * テーブルを配列に変換
 */
export function parseGradeTable(table: HTMLTableElement): GradeRow[] {
    const rows: GradeRow[] = [];

    for (let i = TABLE_DATA_START_ROW_INDEX; i < table.rows.length; i++) {
        const row = table.rows[i];

        rows.push({
            element: row,
            no: parseFloat(row.cells[GRADE_COLUMN_INDEX.NO]?.textContent || '0'),
            openingNumber: row.cells[GRADE_COLUMN_INDEX.OPENING_NUMBER]?.textContent || '',
            score: row.cells[GRADE_COLUMN_INDEX.SCORE]?.textContent?.trim()
                ? parseFloat(row.cells[GRADE_COLUMN_INDEX.SCORE].textContent)
                : NaN,
            credits: parseFloat(row.cells[GRADE_COLUMN_INDEX.CREDITS]?.textContent || '0'),
            gp: parseFloat(row.cells[GRADE_COLUMN_INDEX.GP]?.textContent || '0'),
        });
    }

    return rows;
}

/**
 * ソートされた配列でテーブルを更新
 */
export function updateGradeTable(table: HTMLTableElement, rows: GradeRow[]): void {
    const elements = rows.map((row) => row.element);
    reorderTableRows(table, elements);
}

/**
 * No.順でソート
 */
export function sortGradesByNumber(table: HTMLTableElement): void {
    const gradeArray = parseGradeTable(table);
    const sorted = sortBy(gradeArray, [(row) => row.no]);
    updateGradeTable(table, sorted);
}

/**
 * 開講番号順でソート
 */
export function sortGradesByOpeningNumber(table: HTMLTableElement): void {
    const gradeArray = parseGradeTable(table);
    const sorted = sortBy(gradeArray, [(row) => row.openingNumber]);
    updateGradeTable(table, sorted);
}

/**
 * 得点順でソート
 * 得点が空のものは上にまとめ、元の順番を保持
 * 得点があるものは昇順でソート
 */
export function sortGradesByScore(table: HTMLTableElement): void {
    const gradeArray = parseGradeTable(table);

    // es-toolkitのsortByを使用してソート
    const sorted = sortBy(gradeArray, [
        (row) => isNaN(row.score) ? 0 : 1, // NaNを優先
        (row) => row.score,
    ]);

    updateGradeTable(table, sorted);
}
