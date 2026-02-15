/**
 * レポート/課題機能の定数
 */

/**
 * レポートテーブルの列インデックス
 */
export const REPORT_COLUMN_INDEX = {
    /** 開講番号 */
    OPENING_NUMBER: 0,
    /** タイトル */
    TITLE: 1,
    /** 提出状態 */
    STATUS: 2,
    /** 実施内容 */
    CONTENT: 3,
    /** 提出開始日時 */
    START_DATE: 4,
    /** 提出終了日時 */
    END_DATE: 5,
    /** 最終提出日時 */
    LAST_SUBMIT: 6,
    /** 実施期間 */
    PERIOD: 7,
    /** 操作 */
    ACTION: 8,
} as const;

/**
 * 提出状態の種類
 */
export enum SubmissionStatus {
    /** 未提出 */
    NOT_SUBMITTED = 1,
    /** 一時保存 */
    TEMP_SAVED = 2,
    /** 提出済 */
    SUBMITTED = 3,
}

/**
 * 提出状態の文字列パターン
 */
export const SUBMISSION_STATUS_PATTERNS = {
    NOT_SUBMITTED: /未提出|Not submitted/,
    TEMP_SAVED: /一時保存|Temporarily saved/,
    SUBMITTED: /提出済|Submitted/,
} as const;

/**
 * ソートボタンのID
 */
export const SORT_BUTTON_IDS = {
    DATE: 'reportDateButton',
    TITLE: 'reportTitleButton',
    CODE: 'reportCodeButton',
} as const;

/**
 * ソートボタンのラベル
 */
export const SORT_BUTTON_LABELS = {
    DATE: '提出期間でソート',
    TITLE: 'タイトルでソート',
    CODE: '開講番号でソート',
} as const;

/**
 * 一時保存の表示色
 */
export const TEMP_SAVED_COLOR = 'blue';
