/**
 * Base32秘密鍵のバリデーションとサニタイゼーション
 */

/**
 * Base32文字列をサニタイズ（スペース・ハイフン除去、大文字化）
 */
export function sanitizeBase32(key: string): string {
  // スペースとハイフンを除去
  let sanitized = key.replace(/[\s-]/g, '');
  
  // 大文字に変換
  sanitized = sanitized.toUpperCase();
  
  return sanitized;
}

/**
 * Base32文字列が有効か検証
 */
export function isValidBase32(key: string): boolean {
  // 空文字列チェック
  if (!key || key.length === 0) {
    return false;
  }
  
  // Base32文字セット (A-Z, 2-7) + パディング (=)
  const base32Regex = /^[A-Z2-7]+=*$/;
  
  return base32Regex.test(key);
}

/**
 * Base32鍵をバリデーションとサニタイズを行って返す
 * @throws {Error} 無効な鍵の場合
 */
export function validateAndSanitizeKey(key: string): string {
  const sanitized = sanitizeBase32(key);
  
  if (!isValidBase32(sanitized)) {
    throw new Error('Invalid Base32 secret key. Must contain only A-Z and 2-7.');
  }
  
  return sanitized;
}
