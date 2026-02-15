/**
 * 日付操作ユーティリティ
 * 'date-fns' ライブラリを使用して実装を標準化
 */

import { format, parse } from 'date-fns';

/**
 * 現在日時を学情形式 (YYYYMMDDHHmm) で取得
 */
export function getCurrentDateTimeFormatted(): string {
    return format(new Date(), 'yyyyMMddHHmm');
}

/**
 * 学情形式 (YYYYMMDDHHmm) の文字列をDateオブジェクトに変換
 */
export function parseGakujoDate(dateStr: string): Date {
    return parse(dateStr, 'yyyyMMddHHmm', new Date());
}

/**
 * 二つの学情形式の日付を比較
 * @returns 1 (a > b), -1 (a < b), 0 (a == b)
 */
export function compareGakujoDates(a: string, b: string): number {
    if (a === b) return 0;
    return a > b ? 1 : -1;
}
