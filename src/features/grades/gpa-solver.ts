/**
 * GPA計算・成績ソート機能のUI初期化
 * - ソートボタンの生成
 * - GPA表示
 * - イベントリスナーの設定
 */

import { GRADE_TABLE_SELECTOR, TAB_MENU_TABLE_ID, MAIN_IFRAME_SELECTOR } from '@/core/constants';
import { TABLE_HEADER_ROW_INDEX } from '@/core/constants';
import { getTableInFrame, waitForElementInFrame, createButton, append } from '@/core/dom';
import {
    GRADE_COLUMN_INDEX,
    GRADE_SORT_BUTTON_IDS,
    GRADE_SORT_BUTTON_LABELS,
} from './constants';
import {
    calculateGpa,
    formatGpaHeader,
    sortGradesByNumber,
    sortGradesByOpeningNumber,
    sortGradesByScore,
} from './gpa-domain';


/**
 * ソートボタンを作成
 */
function createSortButtons(table: HTMLTableElement): void {
    const tabMenuTable = document.getElementById(TAB_MENU_TABLE_ID);
    if (!tabMenuTable) {
        console.warn('[GPA Solver] tabmenutable not found');
        return;
    }

    append(
        tabMenuTable,
        createButton(GRADE_SORT_BUTTON_LABELS.NUMBER, () => sortGradesByNumber(table), { id: GRADE_SORT_BUTTON_IDS.NUMBER }),
        createButton(GRADE_SORT_BUTTON_LABELS.OPENING_NUMBER, () => sortGradesByOpeningNumber(table), { id: GRADE_SORT_BUTTON_IDS.OPENING_NUMBER }),
        createButton(GRADE_SORT_BUTTON_LABELS.SCORE, () => sortGradesByScore(table), { id: GRADE_SORT_BUTTON_IDS.SCORE })
    );
}

/**
 * GPAを表示
 */
function displayGpa(table: HTMLTableElement): void {
    const gpa = calculateGpa(table);
    const headerCell = table.rows[TABLE_HEADER_ROW_INDEX].cells[GRADE_COLUMN_INDEX.GP];

    if (headerCell) {
        headerCell.textContent = formatGpaHeader(headerCell.textContent || '', gpa);
    }

    console.log('[GPA Solver] GPA calculated:', gpa.toFixed(4));
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
    // テーブルが現れるまで待機
    await waitForElementInFrame(MAIN_IFRAME_SELECTOR, GRADE_TABLE_SELECTOR);

    const table = getTableInFrame(GRADE_TABLE_SELECTOR);
    if (!table) {
        console.error('[GPA Solver] Failed to get grade table');
        return;
    }

    displayGpa(table);
    createSortButtons(table);
    console.log('[GPA Solver] Initialized');
}

// ページロード時に実行
if (typeof window !== 'undefined') {
    window.addEventListener('load', main);
}
