/**
 * TOTP/HOTP実装
 * Based on totp-js by A99US
 */

import { hexToArray, arrayToHex, int32toHex } from './convert';

export interface TotpOptions {
  /** トークンの桁数 (通常6桁) */
  size?: number;
  /** カウンター値 (HOTPモード用) */
  counter?: number | false;
  /** TOTP間隔 (秒) */
  interval?: number | false;
  /** デバッグログ出力 */
  debug?: boolean;
}

/**
 * 指定時刻のTOTPカウンター値を計算
 */
export function getOtpCounter(time: number, interval: number): number {
  return (time / interval) | 0;
}

/**
 * 現在のTOTPカウンター値を取得
 */
export function getCurrentCounter(interval: number = 30): number {
  return getOtpCounter((Date.now() / 1000) | 0, interval);
}

/**
 * 次の時間枠までのカウントダウン秒数を取得
 */
export function getCountdown(interval: number = 30): number {
  return interval - (((Date.now() / 1000) | 0) % interval);
}

/**
 * SHA-1 HMACを計算
 */
export async function hmac(
  keyHex: string,
  valueHex: string,
  debug: boolean = false
): Promise<string> {
  const algo: HmacImportParams = {
    name: 'HMAC',
    hash: 'SHA-1',
  };
  const modes: KeyUsage[] = ['sign', 'verify'];
  const key = Uint8Array.from(hexToArray(keyHex));
  const value = Uint8Array.from(hexToArray(valueHex));

  let result = await crypto.subtle.importKey('raw', key, algo, false, modes);
  if (debug) console.debug('Key imported', keyHex);
  
  const signature = await crypto.subtle.sign(algo, result, value);
  const hexResult = arrayToHex(signature);
  if (debug) console.debug('HMAC calculated', value, hexResult);
  
  return hexResult;
}

/**
 * TOTP/HOTPトークンを生成
 */
export async function generateOtp(
  keyHex: string,
  options: TotpOptions = {}
): Promise<string> {
  const {
    size = 6,
    counter = false,
    interval = false,
    debug = false,
  } = options;

  const isInt = (x: number): boolean => (x === x) | 0;

  if (typeof keyHex !== 'string') {
    throw new Error('Invalid hex key');
  }

  let counterInt: number;
  if (counter === false) {
    counterInt = getCurrentCounter();
  } else if (typeof counter !== 'number' || !isInt(counter)) {
    throw new Error('Invalid counter value');
  } else {
    counterInt = counter;
  }

  if (typeof size !== 'number' || size < 6 || size > 10 || !isInt(size)) {
    throw new Error('Invalid size value (default is 6)');
  }

  if (interval !== false) {
    if (typeof interval !== 'number' || !isInt(interval)) {
      throw new Error('Invalid interval value');
    }
    counterInt += getCurrentCounter(interval);
  }

  // HMACを計算
  const mac = await hmac(
    keyHex,
    '00000000' + int32toHex(counterInt),
    debug
  );

  // 最後の4ビットがオフセットを決定
  const offset = parseInt(mac.substr(-1), 16);
  
  // 32ビット数値として抽出し、符号ビットを破棄
  let code = parseInt(mac.substr(offset * 2, 8), 16) & 0x7fffffff;
  
  // トークンを指定桁数にトリム/パディング
  const token = ('0000000000' + (code % Math.pow(10, size))).substr(-size);
  
  if (debug) console.debug('Token', token);
  return token;
}

/**
 * ブラウザがTOTP実装に対応しているか確認
 */
export function isCompatible(): boolean {
  if (typeof crypto === 'undefined' || typeof Uint8Array !== 'function') {
    return false;
  }
  
  if (!crypto.subtle) {
    return false;
  }
  
  return !!(
    typeof crypto.subtle.importKey === 'function' &&
    typeof crypto.subtle.sign === 'function' &&
    typeof crypto.subtle.digest === 'function'
  );
}
