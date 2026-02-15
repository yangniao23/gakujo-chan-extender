/**
 * TOTP/HOTP実装
 * 'otpauth' ライブラリを使用して実装を標準化
 */

import * as OTPAuth from 'otpauth';

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
 * TOTP/HOTPトークンを生成
 */
export async function generateOtp(
  keyHex: string,
  options: TotpOptions = {}
): Promise<string> {
  const {
    size = 6,
    counter = false,
    interval = 30, // デフォルト30秒
  } = options;

  const secret = OTPAuth.Secret.fromHex(keyHex);

  if (counter !== false) {
    // HOTPモード
    const hotp = new OTPAuth.HOTP({
      issuer: 'Gakujo',
      label: 'User',
      algorithm: 'SHA1',
      digits: size,
      counter: counter,
      secret: secret,
    });
    return hotp.generate();
  } else {
    // TOTPモード
    const totp = new OTPAuth.TOTP({
      issuer: 'Gakujo',
      label: 'User',
      algorithm: 'SHA1',
      digits: size,
      period: typeof interval === 'number' ? interval : 30,
      secret: secret,
    });
    return totp.generate();
  }
}

/**
 * ブラウザがTOTP実装に対応しているか確認
 */
export function isCompatible(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
}
