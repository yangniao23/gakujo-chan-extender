/**
 * 二段階認証(2FA)自動入力機能
 * ログインページでTOTPトークンを自動生成・入力
 */

import { waitForElement } from '@/core/dom/element-waiter';
import { storage } from '@/core/browser/api';
import { base32toHex } from '@/core/auth/convert';
import {
  generateOtp,
  getCurrentCounter,
  getCountdown,
  isCompatible,
} from '@/core/auth/totp';
import {
  sanitizeBase32,
  isValidBase32,
  validateAndSanitizeKey,
} from '@/core/auth/validation';
import {
  createButton,
  createInput,
  createLink,
  append,
  on,
} from '@/core/dom/element-factory';
import {
  getElementById,
  getElementsByTagName,
} from '@/core/dom/element-query';
import {
  setValue,
  getValue,
} from '@/core/dom/element-advanced';

const STORAGE_KEY = 'key';
const CHECK_INTERVAL = 100; // ms
const INITIAL_DELAY = 500; // ms

/**
 * 2FA UIを構築
 */
function buildUI(): void {
  console.log('[2FA] buildUI called');
  
  const forms = getElementsByTagName('form');
  const form = forms[0];
  if (!form) {
    console.warn('[2FA] Form element not found');
    return;
  }

  console.log('[2FA] Form found, building UI...');

  // 説明文1
  append(form, document.createElement('br'));
  const p1 = document.createElement('p');
  p1.textContent = '学情拡張スクリプト動作中';
  append(form, p1);

  // 説明文2
  append(form, document.createElement('br'));
  const p2 = document.createElement('p');
  p2.textContent = '拡張機能2FA鍵保存フォーム';
  append(form, p2);

  // 秘密鍵入力フォーム
  const keyEntryForm = createInput('text', {
    id: 'keyEntryForm',
    attributes: {
      size: '50',
    },
  });
  append(form, keyEntryForm);

  // 保存ボタン
  const keySaveButton = createButton(
    'save',
    handleKeySave,
    {
      id: 'keySaveButton',
    }
  );
  append(form, keySaveButton);

  // GitHubリンク
  const githubLink = createLink(
    'https://github.com/koji-genba/gakujo-chan-extender#2%E6%AE%B5%E9%9A%8E%E8%AA%8D%E8%A8%BC%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97%E6%96%B9%E6%B3%95',
    '二段階認証自動入力機能の使い方説明はこちら',
    {
      attributes: { target: '_blank' },
    }
  );
  append(form, githubLink);
}

/**
 * 秘密鍵保存処理
 */
async function handleKeySave(): Promise<void> {
  const input = getElementById('keyEntryForm', 'input');
  if (!input) return;

  const rawKey = getValue(input);
  try {
    const cleanedKey = validateAndSanitizeKey(rawKey);
    await storage.set(STORAGE_KEY, cleanedKey);
    alert('2FA鍵を保存しました');
  } catch (error) {
    alert('Key形式が不正です (Base32 A-Z2-7)。');
    console.error('[2FA] Key validation failed:', error);
  }
}

/**
 * TOTPトークンを生成して入力フィールドに設定
 */
async function fillTotpToken(): Promise<void> {
  console.log('[2FA] fillTotpToken called');
  
  try {
    const rawBase32 = await storage.get<string>(STORAGE_KEY);

    if (!rawBase32) {
      console.debug('[2FA] No stored key');
      return;
    }

    console.log('[2FA] Stored key found, processing...');

    // Base32キーをサニタイズ
    const cleanedBase32 = sanitizeBase32(rawBase32);
    if (!isValidBase32(cleanedBase32)) {
      console.warn('[2FA] Base32 key invalid after sanitize', rawBase32);
      return;
    }

    // Hex変換
    let hexKey: string;
    try {
      hexKey = base32toHex(cleanedBase32);
    } catch (error) {
      console.error('[2FA] base32->hex failed', error);
      return;
    }

    // トークン生成
    const counter = getCurrentCounter();
    const countdown = getCountdown();
    let token: string;
    try {
      token = await generateOtp(hexKey, { size: 6, debug: true });
    } catch (error) {
      console.error('[2FA] TOTP generation failed', error);
      return;
    }

    // 入力フィールドに設定
    const inputFields = getElementsByTagName('input');
    let inputField: HTMLInputElement | null = null;
    for (let i = 0; i < inputFields.length; i++) {
      if (inputFields[i].name === 'ninshoCode') {
        inputField = inputFields[i];
        break;
      }
    }

    if (!inputField) {
      console.warn('[2FA] ninshoCode field not found');
      return;
    }

    inputField.type = 'text';
    setValue(inputField, token);
    inputField.focus();

    // デバッグログ
    console.log('[2FA] 1.Raw:', rawBase32);
    console.log('[2FA] 2.Cleaned:', cleanedBase32);
    console.log('[2FA] 3.Hex:', hexKey);
    console.log('[2FA] 4.Counter:', counter, 'Countdown:', countdown);
    console.log('[2FA] 5.Token:', token);

    if (token === '000000') {
      console.warn(
        '[2FA] Token 000000. Check key correctness, system clock, and HMAC debug output above.'
      );
    }
  } catch (error) {
    console.error('[2FA] Token fill failed:', error);
  }
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
  console.log('[2FA] main called');
  
  if (!isCompatible()) {
    console.error('[2FA] Browser not compatible with TOTP');
    return;
  }

  console.log('[2FA] Browser compatible, proceeding...');
  buildUI();
  await fillTotpToken();
  console.log('[2FA] Initialization complete');
}

/**
 * 初期化: Google Authenticatorのログイン画面を待機
 */
export function init(): void {
  console.log('[2FA] Init called');
  
  setTimeout(() => {
    const timer = setInterval(() => {
      const loginBody = getElementById('google-authenticator-login-body');
      const alreadyActive = getElementById('portaltimerimg');

      // 2FA画面が見つかり、かつまだアクティブでない場合のみ実行
      if (loginBody && !alreadyActive) {
        console.log('[2FA] 2FA page detected, initializing...');
        clearInterval(timer);
        main();
      }
      
      // 既にアクティブ（ポータル画面）なら停止
      if (alreadyActive) {
        console.log('[2FA] Portal already active, stopping...');
        clearInterval(timer);
      }
    }, CHECK_INTERVAL);
  }, INITIAL_DELAY);
}
