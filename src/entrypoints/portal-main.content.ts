/**
 * ポータルメインページ用コンテンツスクリプト
 * - セッション自動延長
 * - バージョン表示
 */

import '@/features/session/auto-extend';
import '@/features/ui/version-display';

export default defineContentScript({
    matches: ['https://gakujo.iess.niigata-u.ac.jp/campusweb/campusportal.do*'],
    allFrames: true,
    main() {
        console.log('[Portal Main] Initialized');
    },
});
