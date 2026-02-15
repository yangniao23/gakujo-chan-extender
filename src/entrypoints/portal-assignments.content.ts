/**
 * 課題ページ用コンテンツスクリプト
 * レポートソート機能
 */

import '@/features/assignments/report-sorter';

export default defineContentScript({
    matches: [
        'https://gakujo.iess.niigata-u.ac.jp/campusweb/campusportal.do?*tabId=en',
    ],
    allFrames: true,
    runAt: 'document_end',
    main() {
        console.log('[Portal Assignments] Initialized');
    },
});
