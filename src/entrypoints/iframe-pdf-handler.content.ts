/**
 * iframe内でのPDF/ドキュメントリンク制御
 * iframe内のリンクがクリックされた際、新しいタブで開くように調整する
 */

import { browser } from 'wxt/browser';

export default defineContentScript({
    matches: ['https://gakujo.iess.niigata-u.ac.jp/campusweb/*'],
    allFrames: true, // 全てのiframe内で実行
    main() {
        // メインフレーム（最上位）では実行しない
        if (window.self === window.top) return;

        document.addEventListener('click', async (event) => {
            const target = event.target as HTMLElement;
            const anchor = target.closest('a');

            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:')) return;

            // 学情のダウンロードリンクやPDFらしきパスを検知
            const isDownloadLink = href.includes('download') || 
                                 href.includes('file') || 
                                 href.toLowerCase().endsWith('.pdf');

            if (isDownloadLink) {
                // デフォルトの挙動を停止（背景スクリプトでタブを開くため）
                event.preventDefault();
                event.stopPropagation();

                // リンクテキストをファイル名として取得
                const filename = anchor.innerText.trim() || 'document';
                
                // 絶対URLを取得
                const absoluteUrl = new URL(href, window.location.href).href;

                console.log(`[IframePdfHandler] Requesting background to open ${filename}...`);

                try {
                    // 背景スクリプトに「タブを開いてタイトルを設定する」よう依頼
                    await browser.runtime.sendMessage({
                        type: 'OPEN_PDF',
                        url: absoluteUrl,
                        filename: filename
                    });
                } catch (error) {
                    console.error('[IframePdfHandler] Failed to delegate PDF opening:', error);
                    // 失敗した時のフォールバック
                    window.open(absoluteUrl, '_blank');
                }
            }
        }, true);
    },
});
