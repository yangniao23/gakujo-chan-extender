/**
 * テーブル操作のヘルパー関数
 */

import { BaseTableRow } from '@/core/types';

/**
 * テーブルの行をHTML状態で配列に抽出
 * @param table HTMLTableElement
 * @returns HTML文字列の配列（ヘッダー行を除く）
 */
export function extractTableRowsRaw(table: HTMLTableElement): string[][] {
    if (!table || table.rows.length === 0) {
        return [];
    }

    const result: string[][] = [];
    const colCount = table.rows[0].cells.length;

    // ヘッダー行（i=0）をスキップ
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cells: string[] = [];

        for (let j = 0; j < colCount; j++) {
            cells[j] = row.cells[j]?.innerHTML || '';
        }

        result.push(cells);
    }

    return result;
}

/**
 * テーブルのテキスト内容を行の配列に抽出
 * @param table HTMLTableElement
 * @returns テキスト内容の配列
 */
export function extractTableRowsText(table: HTMLTableElement): string[][] {
    if (!table || table.rows.length === 0) {
        return [];
    }

    const result: string[][] = [];
    const colCount = table.rows[0].cells.length;

    // ヘッダー行（i=0）をスキップ
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cells: string[] = [];

        for (let j = 0; j < colCount; j++) {
            cells[j] = row.cells[j]?.textContent || '';
        }

        result.push(cells);
    }

    return result;
}

/**
 * テーブルを行オブジェクトの配列に変換
 * @param table HTMLTableElement
 * @param parser 各行をパースする関数
 * @returns パースされた行オブジェクトの配列
 */
export function parseTableRows<T extends BaseTableRow>(
    table: HTMLTableElement,
    parser: (cells: string[], index: number) => T
): T[] {
    const rows = extractTableRowsRaw(table);
    return rows.map((cells, index) => parser(cells, index));
}

/**
 * テーブルの行を更新
 * @param table HTMLTableElement
 * @param rows 新しい行HTML（ヘッダー行を除く）
 */
export function updateTableRows(table: HTMLTableElement, rows: string[][]): void {
    if (!table || rows.length === 0) {
        return;
    }

    const colCount = table.rows[0].cells.length;

    for (let i = 0; i < rows.length; i++) {
        const row = table.rows[i + 1]; // ヘッダー分をオフセット
        if (!row) break;

        for (let j = 0; j < colCount; j++) {
            if (j < rows[i].length) {
                row.cells[j].innerHTML = rows[i][j];
            }
        }
    }
}

/**
 * テーブルから特定の列を抽出
 * @param table HTMLTableElement
 * @param columnIndices 抽出する列のインデックス
 * @returns 指定列のみの2次元配列
 */
export function extractColumns(
    table: HTMLTableElement,
    columnIndices: number[]
): string[][] {
    const rows = extractTableRowsRaw(table);
    return rows.map((row) => columnIndices.map((idx) => row[idx] || ''));
}

/**
 * テーブルから特定の列のテキストを抽出（HTMLタグを除去）
 * @param table HTMLTableElement
 * @param columnIndex 抽出する列のインデックス
 * @returns テキスト内容の配列
 */
export function extractColumnText(table: HTMLTableElement, columnIndex: number): string[] {
    const rows = extractTableRowsText(table);
    return rows.map((row) => row[columnIndex] || '');
}

/**
 * テーブル行をソート
 * @param table HTMLTableElement
 * @param rows ソート済みの行オブジェクト配列
 */
export function sortTableWithObjects<T extends BaseTableRow>(
    table: HTMLTableElement,
    rows: T[]
): void {
    const htmlRows = rows.map((row) => row.cells);
    updateTableRows(table, htmlRows);
}
