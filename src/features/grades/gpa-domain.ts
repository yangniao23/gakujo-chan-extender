/**
 * GPA計算・成績分析のビジネスロジック
 * - GPA計算
 * - テーブルデータの解析
 * - ソート処理
 */

import { TABLE_DATA_START_ROW_INDEX, TABLE_HEADER_ROW_INDEX } from '@/core/constants';
import { updateTableRows } from '@/core/dom';
import {
    GRADE_COLUMN_INDEX,
    GPA_DECIMAL_PLACES,
} from './constants';

/**
 * 成績行のデータ構造
 */
export interface GradeRow {
    cells: string[];
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
    const gpCredits: number[] = [];
    const credits: number[] = [];

    for (let i = TABLE_DATA_START_ROW_INDEX; i < table.rows.length; i++) {
        const row = table.rows[i];
        const gpText = row.cells[GRADE_COLUMN_INDEX.GP]?.textContent || '';
        const creditText = row.cells[GRADE_COLUMN_INDEX.CREDITS]?.textContent || '';

        // GPの値が数字を含む場合のみ計算
        if (gpText.match(/[0-9]/)) {
            const gp = parseFloat(gpText) || 0;
            const credit = parseFloat(creditText) || 0;

            gpCredits.push(gp * credit);
            credits.push(credit);
        }
    }

    const gpSum = gpCredits.reduce((sum, val) => sum + val, 0);
    const creditSum = credits.reduce((sum, val) => sum + val, 0);

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
    const colCount = table.rows[TABLE_HEADER_ROW_INDEX].cells.length;

    for (let i = TABLE_DATA_START_ROW_INDEX; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cells: string[] = [];

        for (let j = 0; j < colCount; j++) {
            cells[j] = row.cells[j].innerHTML;
        }

        rows.push({
            cells,
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
    const htmlRows = rows.map((row) => row.cells);
    updateTableRows(table, htmlRows);
}

/**
 * No.順でソート
 */
export function sortGradesByNumber(table: HTMLTableElement): void {
    const gradeArray = parseGradeTable(table);

    gradeArray.sort((a, b) => a.no - b.no);

    updateGradeTable(table, gradeArray);
    console.log('[GPA Solver] Sorted by No.');
}

/**
 * 開講番号順でソート
 */
export function sortGradesByOpeningNumber(table: HTMLTableElement): void {
    const gradeArray = parseGradeTable(table);

    gradeArray.sort((a, b) => {
        if (a.openingNumber < b.openingNumber) return -1;
        if (a.openingNumber > b.openingNumber) return 1;
        return 0;
    });

    updateGradeTable(table, gradeArray);
    console.log('[GPA Solver] Sorted by opening number');
}

/**
 * 得点順でソート
 * 得点が空のものは上にまとめ、元の順番を保持
 * 得点があるものは昇順でソート
 */
export function sortGradesByScore(table: HTMLTableElement): void {
    const gradeArray = parseGradeTable(table);

    // 元の順番を保持するためにインデックスを追加
    const gradeArrayWithIndex = gradeArray.map((row, index) => ({ ...row, originalIndex: index }));

    gradeArrayWithIndex.sort((a, b) => {
        const aHasScore = !isNaN(a.score);
        const bHasScore = !isNaN(b.score);

        // 両方とも得点が空の場合は元の順番を保持
        if (!aHasScore && !bHasScore) {
            return a.originalIndex - b.originalIndex;
        }

        // aが空の場合は上に
        if (!aHasScore) return -1;
        // bが空の場合は上に
        if (!bHasScore) return 1;

        // 両方とも得点がある場合は昇順でソート
        if (a.score !== b.score) {
            return a.score - b.score;
        }

        // 得点が同じ場合は元の順番を保持
        return a.originalIndex - b.originalIndex;
    });

    updateGradeTable(table, gradeArrayWithIndex);
    console.log('[GPA Solver] Sorted by score');
}
