/**
 * セッションタイムアウト自動延長機能
 * 残り時間が11分を切ったら時計アイコンをクリックして延長
 */

import { PORTAL_TIMER_IMG_ID } from '@/core/constants';
import { startPolling } from '@/core/dom/polling';

const TIMEOUT_THRESHOLD_MINUTES = 11;
const CHECK_INTERVAL = 60000; // 1分ごと
const MAX_ATTEMPTS = 10;
const TIMER_ELEMENT_ID = 'timeout-timer';

/**
 * セッション延長を実行
 */
function extendSession(): boolean {
  const timerElement = document.getElementById(TIMER_ELEMENT_ID);
  const timerIcon = document.getElementById(PORTAL_TIMER_IMG_ID);

  if (!timerElement || !timerIcon) {
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

  startPolling(() => {
    const extended = extendSession();
    
    if (extended) {
      attemptCount++;
    }

    if (attemptCount >= MAX_ATTEMPTS) {
      console.log('[AutoExtender] Max attempts reached, stopping auto-extend');
      throw new Error('Stop polling'); // startPolling does not have a clean way to stop other than error or timeout
    }
  }, {
    interval: CHECK_INTERVAL,
    maxAttempts: Infinity, // Use custom logic for attempts
  });
}

// 実行
if (typeof window !== 'undefined') {
  startAutoExtend();
}
