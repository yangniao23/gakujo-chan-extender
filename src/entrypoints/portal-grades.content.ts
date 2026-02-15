/**
 * 成績ページ用コンテンツスクリプト
 * GPA計算・成績ソート機能
 */

import '@/features/grades/gpa-solver';

export default defineContentScript({
    matches: [
        'https://gakujo.iess.niigata-u.ac.jp/campusweb/campusportal.do?*tabId=si',
    ],
    allFrames: true,
    runAt: 'document_end',
    main() {
        console.log('[Portal Grades] Initialized');
    },
});
