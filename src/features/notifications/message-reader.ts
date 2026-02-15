/**
 * メッセージリーダー機能
 * 学情の通知を一括で既読にするUI
 */

import { runtime } from '@/core/browser/api';
import { LOAD_CHECK_INTERVAL, RELOAD_DELAY } from '@/core/constants';
import { MAIN_IFRAME_ID, NOTIFICATION_TABLE_SELECTOR, TAB_MENU_TABLE_ID } from '@/core/constants';
import {
    NOTIFICATION_COLUMN_INDEX,
    MESSAGE_READER_IDS,
    MESSAGE_READER_LABELS,
    DEFAULT_READ_COUNT,
    GAKUJO_BASE_URL,
    URL_PATTERNS,
} from './constants';

/**
 * 通知テーブルを取得
 */
function loadNotificationTable(): HTMLTableElement | null {
  const iframe = document.getElementById(MAIN_IFRAME_ID) as HTMLIFrameElement;
  if (!iframe || !iframe.contentWindow) {
    return null;
  }

  const table = iframe.contentWindow.document.querySelector(
    NOTIFICATION_TABLE_SELECTOR
  ) as HTMLTableElement | null;
  return table;
}

/**
 * テーブルを2次元配列に変換
 */
function tableToArray(table: HTMLTableElement): string[][] {
  const result: string[][] = [];

  for (let i = 1; i < table.rows.length; i++) {
    result[i] = [];
    const row = table.rows[i];
    for (let j = 0; j < table.rows[0].cells.length; j++) {
      result[i][j] = row.cells[j].innerHTML;
    }
  }

  return result;
}

/**
 * HTMLからURLを抽出
 */
function extractUrlFromHtml(html: string): string {
  // href="..." パターンから抽出
  let url = html.substring(html.indexOf(URL_PATTERNS.HREF_START) + 2);
  url = url.substring(0, url.indexOf(URL_PATTERNS.HREF_END));

  // HTMLエンティティをデコード
  while (url.indexOf(URL_PATTERNS.AMP_ENTITY) !== -1) {
    url = url.replace(URL_PATTERNS.AMP_ENTITY, '');
  }

  return GAKUJO_BASE_URL + url;
}

/**
 * 既読ボタンのクリックハンドラー
 */
async function handleMarkAsRead(): Promise<void> {
  const table = loadNotificationTable();
  if (!table) {
    alert('通知テーブルが見つかりません');
    return;
  }

  const inputBox = document.getElementById(
    MESSAGE_READER_IDS.NUM_INPUT_BOX
  ) as HTMLInputElement | null;
  if (!inputBox) {
    alert('入力フォームが見つかりません');
    return;
  }

  let readNum = parseInt(inputBox.value, 10);
  if (isNaN(readNum)) {
    readNum = 0;
  }

  const tableArray = tableToArray(table);

  // 指定数分だけURLを送信
  for (let i = 1; i <= readNum && i < tableArray.length; i++) {
    const url = extractUrlFromHtml(tableArray[i][NOTIFICATION_COLUMN_INDEX.LINK]);
    try {
      await runtime.sendMessage({ url });
      console.log('[MessageReader] Sent URL:', url);
    } catch (error) {
      console.error('[MessageReader] Failed to send message:', error);
    }
  }

  // 1秒後にページリロード
  setTimeout(() => {
    window.location.reload();
  }, RELOAD_DELAY);
}

/**
 * 既読ボタンを作成
 */
function createMarkAsReadButton(): void {
  const tabMenuTable = document.getElementById(TAB_MENU_TABLE_ID);
  if (!tabMenuTable) {
    console.warn('[MessageReader] tabmenutable not found');
    return;
  }

  const readButton = document.createElement('button');
  readButton.id = MESSAGE_READER_IDS.READ_BUTTON;
  readButton.textContent = MESSAGE_READER_LABELS.BUTTON;
  readButton.addEventListener('click', handleMarkAsRead);

  tabMenuTable.appendChild(readButton);
}

/**
 * 個数入力ボックスを作成
 */
function createNumInputBox(): void {
  const tabMenuTable = document.getElementById(TAB_MENU_TABLE_ID);
  if (!tabMenuTable) {
    console.warn('[MessageReader] tabmenutable not found');
    return;
  }

  const inputBox = document.createElement('input');
  inputBox.id = MESSAGE_READER_IDS.NUM_INPUT_BOX;
  inputBox.type = 'number';
  (inputBox as any).defaultValue = String(DEFAULT_READ_COUNT);
  inputBox.placeholder = MESSAGE_READER_LABELS.INPUT_PLACEHOLDER;
  inputBox.oninput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]+/i, '');
  };

  tabMenuTable.appendChild(inputBox);
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
  const timer = setInterval(() => {
    const table = loadNotificationTable();
    if (table) {
      clearInterval(timer);
      createMarkAsReadButton();
      createNumInputBox();
      console.log('[MessageReader] Initialized');
    }
  }, LOAD_CHECK_INTERVAL);
}

// ページ読み込み時に実行
window.addEventListener('load', main);
