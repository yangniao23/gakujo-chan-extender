/**
 * Base32/Hex変換ユーティリティ
 * Based on totp-js by A99US
 */

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Base32文字列をHex文字列に変換
 */
export function base32toHex(data: string): string {
  if (typeof data !== 'string') {
    throw new Error('Argument to base32toHex() is not a string');
  }
  if (data.length === 0) {
    throw new Error('Argument to base32toHex() is empty');
  }
  if (!/^[A-Z2-7]+=*$/i.test(data)) {
    throw new Error('Argument to base32toHex() contains invalid characters');
  }

  let ret = '';
  const map = BASE32_CHARS.split('');
  const segments = (data.toUpperCase() + '========').match(/.{1,8}/g)!;
  segments.pop();
  
  const strip = segments[segments.length - 1].match(/=*$/)![0].length;
  if (strip > 6) {
    throw new Error('Invalid base32 data (too much padding)');
  }

  for (const segment of segments) {
    let buffer = 0;
    const chars = segment.split('');
    
    for (const char of chars) {
      buffer *= map.length;
      const index = char === '=' ? 0 : map.indexOf(char);
      buffer += index;
    }
    
    const hex = ('0000000000' + buffer.toString(16)).slice(-10);
    ret += hex;
  }

  // Remove bytes according to padding
  switch (strip) {
    case 6: return ret.slice(0, ret.length - 8);
    case 4: return ret.slice(0, ret.length - 6);
    case 3: return ret.slice(0, ret.length - 4);
    case 1: return ret.slice(0, ret.length - 2);
    default: return ret;
  }
}

/**
 * Hex文字列を数値配列に変換
 */
export function hexToArray(hex: string): number[] {
  const matches = hex.match(/[\dA-Fa-f]{2}/g);
  if (!matches) return [];
  return matches.map(v => parseInt(v, 16));
}

/**
 * バイト配列をHex文字列に変換（クロスRealm対応）
 */
export function arrayToHex(array: ArrayBuffer | Uint8Array | number[]): string {
  let hex = '';

  // Robust ArrayBuffer detection
  if (
    Object.prototype.toString.call(array) === '[object ArrayBuffer]' ||
    array instanceof ArrayBuffer
  ) {
    return arrayToHex(new Uint8Array(array));
  }

  const arr = array as Uint8Array | number[];
  for (let i = 0; i < arr.length; i++) {
    hex += ('0' + arr[i].toString(16)).slice(-2);
  }
  
  return hex;
}

/**
 * 32bit整数をHex文字列に変換
 */
export function int32toHex(num: number): string {
  return ('00000000' + Math.floor(Math.abs(num)).toString(16)).slice(-8);
}
