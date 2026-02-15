/**
 * メッセージリーダー機能のUI初期化
 * - 既読ボタンの生成
 * - 入力フォームの生成
 * - イベントリスナーの設定
 */

import { MAIN_IFRAME_SELECTOR, NOTIFICATION_TABLE_SELECTOR, TAB_MENU_TABLE_ID } from '@/core/constants';
import { getFrameDocument, waitForElementInFrame } from '@/core/dom';
import {
  MESSAGE_READER_IDS,
  MESSAGE_READER_LABELS,
  DEFAULT_READ_COUNT,
} from './constants';
import {
  markNotificationsAsRead,
} from './notification-domain';
/**
 * 通知テーブルを取得
 */
function loadNotificationTable(): HTMLTableElement | null {
  const doc = getFrameDocument();
  if (!doc) {
    return null;
  }

  const table = doc.querySelector(
    NOTIFICATION_TABLE_SELECTOR
  ) as HTMLTableElement | null;
  return table;
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

  await markNotificationsAsRead(table, readNum);
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
  inputBox.value = String(DEFAULT_READ_COUNT);
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
  // テーブルが現れるまで待機
  await waitForElementInFrame(MAIN_IFRAME_SELECTOR, NOTIFICATION_TABLE_SELECTOR);

  const table = loadNotificationTable();
  if (!table) {
    console.error('[MessageReader] Failed to get notification table');
    return;
  }

  createMarkAsReadButton();
  createNumInputBox();
  console.log('[MessageReader] Initialized');
}

// ページ読み込み時に実行
window.addEventListener('load', main);
