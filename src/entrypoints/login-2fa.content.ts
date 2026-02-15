/**
 * 二段階認証ページ用コンテンツスクリプト
 */

import { init } from '@/pages/login-2fa';

export default defineContentScript({
    matches: ['https://gakujo.iess.niigata-u.ac.jp/campusweb/*'],
    allFrames: true,
    runAt: 'document_end',
    main() {
        console.log('[2FA Content Script] Initializing...');
        init();
    },
});
