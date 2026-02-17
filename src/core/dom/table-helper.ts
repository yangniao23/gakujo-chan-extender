/**
 * テーブル操作のヘルパー関数
 */

import { TABLE_DATA_START_ROW_INDEX } from '@/core/constants';

/**
 * テーブルの行を物理的に並び替える
 * @param table HTMLTableElement
 * @param sortedRows 並び替え済みの行要素の配列
 */
export function reorderTableRows(table: HTMLTableElement, sortedRows: HTMLTableRowElement[]): void {
    const tbody = table.tBodies[0] || table;
    
    // sortedRows を順番に appendChild すると、既存の要素が自動的に移動する
    sortedRows.forEach(row => {
        tbody.appendChild(row);
    });
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
    const result: string[][] = [];
    
    for (let i = TABLE_DATA_START_ROW_INDEX; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cells: string[] = [];
        columnIndices.forEach(idx => {
            cells.push(row.cells[idx]?.textContent || '');
        });
        result.push(cells);
    }
    
    return result;
}

/**
 * テーブルから特定の列のテキストを抽出（HTMLタグを除去）
 * @param table HTMLTableElement
 * @param columnIndex 抽出する列のインデックス
 * @returns テキスト内容の配列
 */
export function extractColumnText(table: HTMLTableElement, columnIndex: number): string[] {
    const result: string[] = [];
    for (let i = TABLE_DATA_START_ROW_INDEX; i < table.rows.length; i++) {
        result.push(table.rows[i].cells[columnIndex]?.textContent || '');
    }
    return result;
}
