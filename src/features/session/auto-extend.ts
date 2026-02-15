/**
 * セッションタイムアウト自動延長機能
 * 残り時間が11分を切ったら時計アイコンをクリックして延長
 */

const TIMEOUT_THRESHOLD_MINUTES = 11;
const CHECK_INTERVAL = 60000; // 1分ごと
const MAX_ATTEMPTS = 10;

/**
 * セッション延長を実行
 */
function extendSession(): boolean {
  const timerElement = document.getElementById('timeout-timer');
  const timerIcon = document.getElementById('portaltimerimg');

  if (!timerElement || !timerIcon) {
    console.warn('[AutoExtender] Required elements not found');
    return false;
  }

  const remainingMinutes = parseInt(timerElement.textContent || '0', 10);

  if (remainingMinutes <= TIMEOUT_THRESHOLD_MINUTES) {
    (timerIcon as HTMLElement).click();
    console.log(`[AutoExtender] Session extended (remaining: ${remainingMinutes}min)`);
    return true;
  }

  return false;
}

/**
 * 自動延長を開始
 */
function startAutoExtend(): void {
  let attemptCount = 0;

  const timerId = setInterval(() => {
    const extended = extendSession();
    
    if (extended) {
      attemptCount++;
    }

    if (attemptCount > MAX_ATTEMPTS) {
      clearInterval(timerId);
      console.log('[AutoExtender] Max attempts reached, stopping auto-extend');
    }
  }, CHECK_INTERVAL);
}

// 実行
startAutoExtend();
