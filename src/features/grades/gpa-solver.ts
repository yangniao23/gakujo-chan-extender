/**
 * GPA計算・成績ソート機能
 * - GPAを自動計算して表示
 * - No.順でソート
 * - 開講番号順でソート
 * - 得点順でソート
 */

import { LOAD_CHECK_INTERVAL } from '@/core/constants';
import { MAIN_IFRAME_ID, GRADE_TABLE_SELECTOR, TAB_MENU_TABLE_ID } from '@/core/constants';
import {
    GRADE_COLUMN_INDEX,
    GRADE_SORT_BUTTON_IDS,
    GRADE_SORT_BUTTON_LABELS,
    GPA_DECIMAL_PLACES,
} from './constants';

interface GradeRow {
    cells: string[];
    no: number;
    openingNumber: string;
    score: number;
    credits: number;
    gp: number;
}

/**
 * iframe内の成績一覧テーブルを取得
 */
function getGradeTable(): HTMLTableElement | null {
    const iframe = document.getElementById(MAIN_IFRAME_ID) as HTMLIFrameElement;
    if (!iframe?.contentWindow) {
        return null;
    }
    return iframe.contentWindow.document.querySelector(GRADE_TABLE_SELECTOR);
}

/**
 * GPAを計算
 */
function calculateGpa(table: HTMLTableElement): number {
    const gpCredits: number[] = [];
    const credits: number[] = [];

    for (let i = 1; i < table.rows.length; i++) {
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
 * GPAを表示
 */
function displayGpa(): void {
    const table = getGradeTable();
    if (!table) return;

    const gpa = calculateGpa(table);
    const headerCell = table.rows[0].cells[GRADE_COLUMN_INDEX.GP];

    if (headerCell) {
        headerCell.textContent = `${headerCell.textContent}\n GPA:${gpa.toFixed(GPA_DECIMAL_PLACES)}`;
    }

    console.log('[GPA Solver] GPA calculated:', gpa.toFixed(GPA_DECIMAL_PLACES));
}

/**
 * テーブルを配列に変換
 */
function tableToGradeArray(table: HTMLTableElement): GradeRow[] {
    const rows: GradeRow[] = [];
    const colCount = table.rows[0].cells.length;

    for (let i = 1; i < table.rows.length; i++) {
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
function updateTable(table: HTMLTableElement, rows: GradeRow[]): void {
    const colCount = table.rows[0].cells.length;
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < colCount; j++) {
            table.rows[i + 1].cells[j].innerHTML = rows[i].cells[j];
        }
    }
}

/**
 * No.順でソート
 */
function sortByNumber(): void {
    const table = getGradeTable();
    if (!table) return;

    const gradeArray = tableToGradeArray(table);

    gradeArray.sort((a, b) => a.no - b.no);

    updateTable(table, gradeArray);
    console.log('[GPA Solver] Sorted by No.');
}

/**
 * 開講番号順でソート
 */
function sortByOpeningNumber(): void {
    const table = getGradeTable();
    if (!table) return;

    const gradeArray = tableToGradeArray(table);

    gradeArray.sort((a, b) => {
        if (a.openingNumber < b.openingNumber) return -1;
        if (a.openingNumber > b.openingNumber) return 1;
        return 0;
    });

    updateTable(table, gradeArray);
    console.log('[GPA Solver] Sorted by opening number');
}

/**
 * 得点順でソート
 * 得点が空のものは上にまとめ、元の順番を保持
 * 得点があるものは昇順でソート
 */
function sortByScore(): void {
    const table = getGradeTable();
    if (!table) return;

    const gradeArray = tableToGradeArray(table);

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

    updateTable(table, gradeArrayWithIndex);
    console.log('[GPA Solver] Sorted by score');
}

/**
 * ソートボタンを作成
 */
function createSortButtons(): void {
    const tabMenuTable = document.getElementById(TAB_MENU_TABLE_ID);
    if (!tabMenuTable) {
        console.warn('[GPA Solver] tabmenutable not found');
        return;
    }

    // No.順ボタン
    const noButton = document.createElement('button');
    noButton.id = GRADE_SORT_BUTTON_IDS.NUMBER;
    noButton.textContent = GRADE_SORT_BUTTON_LABELS.NUMBER;
    noButton.addEventListener('click', sortByNumber);

    // 開講番号順ボタン
    const openNumButton = document.createElement('button');
    openNumButton.id = GRADE_SORT_BUTTON_IDS.OPENING_NUMBER;
    openNumButton.textContent = GRADE_SORT_BUTTON_LABELS.OPENING_NUMBER;
    openNumButton.addEventListener('click', sortByOpeningNumber);

    // 得点順ボタン
    const scoreButton = document.createElement('button');
    scoreButton.id = GRADE_SORT_BUTTON_IDS.SCORE;
    scoreButton.textContent = GRADE_SORT_BUTTON_LABELS.SCORE;
    scoreButton.addEventListener('click', sortByScore);

    // ボタンを追加
    tabMenuTable.appendChild(noButton);
    tabMenuTable.appendChild(openNumButton);
    tabMenuTable.appendChild(scoreButton);
}

/**
 * メイン処理
 */
function main(): void {
    const timer = setInterval(() => {
        const table = getGradeTable();
        if (table) {
            clearInterval(timer);
            displayGpa();
            createSortButtons();
            console.log('[GPA Solver] Initialized');
        }
    }, LOAD_CHECK_INTERVAL);
}

// ページロード時に実行
if (typeof window !== 'undefined') {
    window.addEventListener('load', main);
}
