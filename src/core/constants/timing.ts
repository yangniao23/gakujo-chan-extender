/**
 * タイミング関連の定数
 */

/**
 * 要素の読み込みチェック間隔（ミリ秒）
 * DOMの変更を監視する際のポーリング間隔
 */
export const LOAD_CHECK_INTERVAL = 100;

/**
 * 初期遅延時間（ミリ秒）
 * ページ読み込み後の初期化開始までの待機時間
 */
export const INITIAL_DELAY = 500;

/**
 * リロード前の遅延時間（ミリ秒）
 * アクション完了後のページリロードまでの待機時間
 */
export const RELOAD_DELAY = 1000;

/**
 * タブ自動クローズまでの時間（ミリ秒）
 * 通知既読処理で開いたタブを閉じるまでの時間
 */
export const TAB_CLOSE_DELAY = 1000;

/**
 * 最大ポーリング試行回数
 * 無限ループを防ぐためのタイムアウト制限
 */
export const MAX_POLLING_ATTEMPTS = 100;
