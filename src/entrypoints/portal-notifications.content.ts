/**
 * 通知ページ用コンテンツスクリプト
 * 通知一括既読機能
 */

import '@/features/notifications/message-reader';

export default defineContentScript({
    matches: [
        'https://gakujo.iess.niigata-u.ac.jp/campusweb/campusportal.do?*tabId=kj',
    ],
    allFrames: true,
    runAt: 'document_end',
    main() {
        console.log('[Portal Notifications] Initialized');
    },
});
