/**
 * 共通型定義
 * プロジェクト全体で使用する型
 */

/**
 * テーブル列インデックスのマッピング
 */
export interface ColumnMapping {
    [key: string]: number;
}

/**
 * 基本的なテーブル行の型
 */
export interface BaseTableRow {
    /** セルのHTML配列 */
    cells: string[];
}

/**
 * ソート方向
 */
export enum SortDirection {
    ASCENDING = 'asc',
    DESCENDING = 'desc',
}

/**
 * ソート比較関数の型
 */
export type SortCompareFn<T> = (a: T, b: T) => number;

/**
 * ポーリング設定
 */
export interface PollingConfig {
    /** チェック間隔（ミリ秒） */
    interval: number;
    /** 最大試行回数 */
    maxAttempts?: number;
    /** タイムアウト時のコールバック */
    onTimeout?: () => void;
}

/**
 * 初期化結果
 */
export interface InitializationResult {
    /** 初期化の成功/失敗 */
    success: boolean;
    /** エラーメッセージ（失敗時） */
    error?: string;
}
