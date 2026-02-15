/**
 * 通知一括既読機能の定数
 */

/**
 * 通知テーブルの列インデックス
 */
export const NOTIFICATION_COLUMN_INDEX = {
    /** 既読/未読状態 */
    STATUS: 0,
    /** 通知リンク */
    LINK: 1,
    /** タイトル */
    TITLE: 2,
    /** 日付 */
    DATE: 3,
} as const;

/**
 * UI要素のID
 */
export const MESSAGE_READER_IDS = {
    /** 既読ボタン */
    READ_BUTTON: 'readButton',
    /** 個数入力ボックス */
    NUM_INPUT_BOX: 'readNumInputBox',
} as const;

/**
 * UI要素のラベル
 */
export const MESSAGE_READER_LABELS = {
    /** ボタンテキスト */
    BUTTON: '指定した個数を既読にする',
    /** 入力プレースホルダー */
    INPUT_PLACEHOLDER: '既読にする数(半角数字)',
} as const;

/**
 * デフォルトの既読個数
 */
export const DEFAULT_READ_COUNT = 5;

/**
 * 学情のベースURL
 */
export const GAKUJO_BASE_URL = 'https://gakujo.iess.niigata-u.ac.jp/campusweb/';

/**
 * URLパターン
 */
export const URL_PATTERNS = {
    /** href属性の開始パターン */
    HREF_START: '=',
    /** href属性の終了パターン */
    HREF_END: '">',
    /** HTMLエンティティ */
    AMP_ENTITY: 'amp;',
} as const;
