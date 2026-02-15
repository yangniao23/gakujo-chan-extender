/**
 * 成績/GPA計算機能の定数
 */

/**
 * 成績テーブルの列インデックス
 */
export const GRADE_COLUMN_INDEX = {
    /** No. */
    NO: 0,
    /** 開講年度 */
    YEAR: 1,
    /** 科目区分 */
    CATEGORY: 2,
    /** 開講番号 */
    OPENING_NUMBER: 3,
    /** 科目名 */
    SUBJECT_NAME: 4,
    /** 教員名 */
    TEACHER: 5,
    /** 単位 */
    CREDITS: 8,
    /** 得点 */
    SCORE: 9,
    /** 評価 */
    GRADE: 10,
    /** GP */
    GP: 12,
} as const;

/**
 * ソートボタンのID
 */
export const GRADE_SORT_BUTTON_IDS = {
    NUMBER: 'noButton',
    OPENING_NUMBER: 'openNumButton',
    SCORE: 'scoreButton',
} as const;

/**
 * ソートボタンのラベル
 */
export const GRADE_SORT_BUTTON_LABELS = {
    NUMBER: 'No.でソート',
    OPENING_NUMBER: '開講番号でソート',
    SCORE: '得点でソート',
} as const;

/**
 * GPA表示の小数点桁数
 */
export const GPA_DECIMAL_PLACES = 4;

/**
 * GPA計算に使用する最小GP値
 * これ以上の値がある場合のみGPA計算に含める
 */
export const MIN_GP_FOR_CALCULATION = 0;
